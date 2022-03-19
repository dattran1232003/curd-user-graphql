import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-core'
import { ErrorResponse } from 'src/common/types'
import { Arg, Mutation, Query } from 'type-graphql'
import { User } from '../schemas'
import { SignUpInput } from '../types/sign-up.input'
import { UserSignInResponse, UserSignUpResponse } from '../types'

export class UserResolver {
  @Query(_ => UserSignInResponse)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<UserSignInResponse> {
    const user = await User.findOne({ email })

    if (!user) {
      throw new ApolloError('Wrong email', 'BAD_USER_INPUT', {
        errors: [
          {
            fieldName: 'email',
            message: 'Wrong email',
          },
        ],
      })
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        username: user.username,
        userType: user.userType,
      },
      process.env.JWT_SECRET as string,
      {
        algorithm: 'HS256',
        expiresIn: '1h',
      }
    )

    const refreshToken = jwt.sign(
      {
        email: user.email,
        username: user.username,
        userType: user.userType,
      },
      process.env.JWT_SECRET as string,
      {
        algorithm: 'HS256',
        expiresIn: '30 days',
      }
    )

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
      throw new ApolloError('Duplicated username or email', 'BAD_USER_INPUT', {
        errors: [
          username === existingUser.username && {
            fieldName: 'username',
            message: 'Username already taken, please choose another one',
          },
          email === existingUser.email && {
            fieldName: 'email',
            message: 'Email already taken, please choose another one',
          },
        ] as ErrorResponse[],
      })
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
}
