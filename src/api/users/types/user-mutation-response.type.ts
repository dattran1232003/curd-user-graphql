import { Field, ObjectType } from 'type-graphql'
import { IUser } from '../interface'
import { UserResponse } from './user-response.type'

@ObjectType()
export class UserMutationResponse {
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
