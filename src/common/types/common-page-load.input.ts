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

  constructor(input: CommonPageLoadInput) {
    if (!input) {
      return
    }
    const { skip, limit } = input
    this.skip = skip ?? 0
    this.limit = limit ?? 10
  }
}

export function CommonPageLoadResponse<T>(itemType: { new (...p: any[]): T }) {
  @ObjectType()
  class CommonPageLoadResponseClass {
    @Field(_ => [itemType])
    items: T[]

    @Field()
    totalItems: number
  }

  return CommonPageLoadResponseClass
}
