import { Field, InputType } from 'type-graphql'
import { USER_TYPE } from '../constants'

@InputType()
export class SignUpInput {
  @Field()
  username: string

  @Field(_ => USER_TYPE)
  userType: USER_TYPE

  @Field()
  email: string

  @Field()
  password: string
}
