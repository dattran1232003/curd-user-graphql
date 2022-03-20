import { IsEmail, IsString, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { USER_TYPE } from '../constants'

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  username: string

  @Field(_ => USER_TYPE)
  userType: USER_TYPE

  @Field()
  @IsEmail()
  @IsString()
  email: string

  @Field()
  @MinLength(6)
  @IsString()
  password: string
}
