import argon2 from 'argon2'
import { ApolloError } from 'apollo-server-core'
import { ErrorResponse } from 'src/common/types'
import { Arg, Mutation, Query } from 'type-graphql'
import { User } from '../schemas'
import { UserMutationResponse } from '../types'
import { SignUpInput } from '../types/sign-up.input'

export class UserResolver {
  @Query(_ => String)
  hello() {
    return 'hello world'
  }

  @Mutation(_ => UserMutationResponse, { nullable: true })
  async signUp(
    @Arg('signUpInput') { username, email, userType, password }: SignUpInput
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOne({
      email,
      username,
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

    const userResponse = new UserMutationResponse(newUser)
    return userResponse
  }
}
