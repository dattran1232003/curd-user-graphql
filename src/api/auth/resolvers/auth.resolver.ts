import { AuthenticationError, UserInputError } from 'apollo-server-core'
import argon2 from 'argon2'
import { RefreshToken } from 'src/api/refresh-tokens/schemas'
import { User } from 'src/api/users/schemas'
import { UserSignInResponse, UserSignUpResponse } from 'src/api/users/types'
import { SignUpInput } from 'src/api/users/types/sign-up.input'
import { generateToken } from 'src/common/functions'
import { ErrorResponse } from 'src/common/types'
import { Arg, Mutation, Query } from 'type-graphql'

export class AuthResolver {
  @Query(_ => UserSignInResponse)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<UserSignInResponse> {
    const user = await User.findOne({ email })

    const isPasswordMatch = user
      ? argon2.verify(user.password, password)
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

  @Mutation(_ => UserSignUpResponse, { nullable: true })
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

    const userResponse = new UserSignUpResponse(newUser)
    return userResponse
  }

  // checkToken(
  //   @Arg('accessToken') accessToken: string
  // ) :Promise<UserSignInResponse>  {
  //
  // }
}
