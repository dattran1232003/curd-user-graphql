import { IsInt, IsNumber, IsOptional, Min } from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'

@InputType()
export class CommonPageLoadInput {
  @IsOptional()
  @Min(0)
  @IsInt()
  @IsNumber()
  @Field({ nullable: true })
  skip: number

  @IsOptional()
  @Min(1)
  @IsInt()
  @IsNumber()
  @Field({ nullable: true })
  limit: number
}

export function CommonPageLoadResponse<T>(itemType: Function) {
  @ObjectType()
  class CommonPageLoadResponseClass {
    @Field(_ => [itemType])
    items: T[]

    @Field()
    totalItems: number
  }

  return CommonPageLoadResponseClass
}
