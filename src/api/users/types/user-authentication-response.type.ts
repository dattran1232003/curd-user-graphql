import { Field, ObjectType } from 'type-graphql'
import { IUser } from '../interfaces'
import { UserResponse } from './user-response.type'

@ObjectType()
export class UserSignUpResponse {
  // code: number
  // message: string
  // success: boolean

  @Field(_ => UserResponse, { nullable: true })
  user?: UserResponse

  // @Field(_ => [ErrorResponse], { nullable: true })
  // errors?: ErrorResponse[]

  constructor(user: IUser) {
    this.user = user && new UserResponse(user)
  }
}

@ObjectType()
export class UserSignInResponse {
  @Field(_ => UserResponse, {
    nullable: true,
  })
  user?: UserResponse

  @Field()
  accessToken: string

  @Field()
  refreshToken: string

  constructor(user: IUser, accessToken: string, refreshToken: string) {
    if (!user || !accessToken || !refreshToken) {
      return
    }

    this.user = user && new UserResponse(user)
    this.accessToken = accessToken || ''
    this.refreshToken = refreshToken || ''
  }
}

@ObjectType()
export class UserCheckTokenResponse {
  @Field(_ => UserResponse, {
    nullable: true,
  })
  user?: UserResponse

  constructor(user: IUser) {
    this.user = user && new UserResponse(user)
  }
}

@ObjectType()
export class UserRefreshTokenResponse extends UserSignInResponse {
  constructor(user: IUser, accessToken: string, refreshToken: string) {
    super(user, accessToken, refreshToken)
  }
}
