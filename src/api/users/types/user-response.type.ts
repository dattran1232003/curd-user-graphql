import { Field, ID, ObjectType } from 'type-graphql'
import { USER_TYPE } from '../constants'
import { IUser } from '../interfaces'

@ObjectType()
export class UserResponse {
  @Field(_ => ID)
  id: string

  @Field(_ => String)
  email: string

  @Field(_ => String)
  username: string

  @Field(_ => USER_TYPE)
  userType: USER_TYPE

  @Field(_ => Date)
  createdAt?: Date

  @Field(_ => Date)
  updatedAt?: Date

  constructor(user: IUser) {
    if (!user) {
      return
    }

    this.id = user._id?.toString() || null
    this.email = user.email || ''
    this.username = user.username || ''
    this.userType = user.userType || ''
    this.createdAt = user.createdAt || null
    this.updatedAt = user.updatedAt || null
  }
}
