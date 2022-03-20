import { AuthenticationError, UserInputError } from 'apollo-server-core'
import argon2 from 'argon2'
import { RefreshToken } from 'src/api/refresh-tokens/schemas'
import { User } from 'src/api/users/schemas'
import {
  UserCheckTokenResponse,
  UserRefreshTokenResponse,
  UserSignInResponse,
  UserSignUpResponse,
} from 'src/api/users/types'
import { SignUpInput } from 'src/api/users/types/sign-up.input'
import { ERROR_CODE, JWT_ERROR_CODE } from 'src/common/constants'
import { checkToken, generateToken } from 'src/common/functions'
import { ErrorResponse } from 'src/common/types'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'

@Resolver()
export class AuthResolver {
  @Mutation(_ => UserSignInResponse, {
    nullable: true,
  })
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<UserSignInResponse> {
    const user = await User.findOne({
      email,
    })

    const isPasswordMatch = user
      ? await argon2.verify(user.password, password)
      : false

    if (!user || !isPasswordMatch) {
      throw new AuthenticationError('Wrong email or password', { errors: [] })
    }

    const [accessToken, refreshToken] = await Promise.all([
      generateToken(user, false),
      generateToken(user, true),
    ])

    const newRefreshToken = new RefreshToken({
      refreshToken,
      userId: user._id,
    })
    await newRefreshToken.save()

    return new UserSignInResponse(user, accessToken, refreshToken)
  }

  @Mutation(_ => UserSignUpResponse, {
    nullable: true,
  })
  async signUp(
    @Arg('signUpInput') { username, email, userType, password }: SignUpInput
  ): Promise<UserSignUpResponse> {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      const errors = [] as ErrorResponse[]
      if (username === existingUser.username) {
        errors.push({
          fieldName: 'username',
          message: 'Username already taken, please choose another one',
        })

        if (email === existingUser.email) {
          errors.push({
            fieldName: 'username',
            message: 'Username already taken, please choose another one',
          })
        }
      }

      throw new UserInputError('Duplicated username or email', { errors })
    }

    password = await argon2.hash(password)

    const newUser = new User({
      email,
      username,
      userType,
      password,
    })

    await newUser.save()

    const [accessToken, refreshToken] = await Promise.all([
      generateToken(newUser, false),
      generateToken(newUser, true),
    ])

    const newRefreshToken = new RefreshToken({
      refreshToken,
      userId: newUser._id,
    })

    await newRefreshToken.save()
    const userResponse = new UserSignUpResponse(
      newUser,
      accessToken,
      refreshToken
    )
    return userResponse
  }

  @Query(_ => UserCheckTokenResponse, {
    nullable: true,
  })
  async checkToken(
    @Arg('accessToken') accessToken: string
  ): Promise<UserCheckTokenResponse> {
    try {
      const decoded = await checkToken(accessToken)

      const user = await User.findOne({
        $or: [
          {
            email: decoded.email,
          },
          {
            username: decoded.username,
          },
        ],
      })

      if (!user) {
        throw new AuthenticationError(JWT_ERROR_CODE.INVALID_TOKEN, {
          errors: [],
        })
      }

      return new UserCheckTokenResponse(user)
    } catch (e) {
      const errorCode = e as JWT_ERROR_CODE

      switch (errorCode) {
        case JWT_ERROR_CODE.JWT_EXPIRED:
          throw new AuthenticationError(ERROR_CODE.TOKEN_EXPIRED, {
            errors: [],
          })
        case JWT_ERROR_CODE.INVALID_TOKEN:
          throw new AuthenticationError(ERROR_CODE.INVALID_TOKEN, {
            errors: [],
          })
        default:
          throw new AuthenticationError(ERROR_CODE.INVALID_TOKEN, {
            errors: [],
          })
      }
    }
  }

  @Mutation(_ => UserRefreshTokenResponse, {
    nullable: true,
  })
  async refreshToken(
    @Arg('refreshToken') refreshToken: string
  ): Promise<UserRefreshTokenResponse> {
    const existingRefreshToken = await RefreshToken.findOne({
      refreshToken,
    })

    if (!existingRefreshToken) {
      throw new AuthenticationError(ERROR_CODE.INVALID_REFRESH_TOKEN)
    }

    const decoded = await checkToken(existingRefreshToken.refreshToken).catch(
      _ => null
    )

    const user = await User.findOne({
      _id: existingRefreshToken.userId,
    })

    if (!decoded || !user) {
      throw new AuthenticationError(ERROR_CODE.INVALID_REFRESH_TOKEN)
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateToken(user, false),
      generateToken(user, true),
    ])

    await new RefreshToken({
      refreshToken: newRefreshToken,
      userId: user._id,
    }).save()

    RefreshToken.deleteOne({ _id: existingRefreshToken._id }).then()

    return new UserRefreshTokenResponse(user, newAccessToken, newRefreshToken)
  }
}
