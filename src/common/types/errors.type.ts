import { Field } from 'type-graphql'

export class ErrorResponse {
  @Field()
  fieldName: string

  @Field({ nullable: true })
  message?: string
}
