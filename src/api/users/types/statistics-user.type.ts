import { IsDateString, IsNotEmpty } from 'class-validator'
import { getEndDate, getStartDate } from 'src/common/functions'
import { CommonPageLoadInput, CommonPageLoadResponse } from 'src/common/types'
import { Field, InputType, ObjectType } from 'type-graphql'
import { UserResponse } from './user-response.type'

@InputType()
export class StatisticsUserInput extends CommonPageLoadInput {
  @IsDateString()
  @IsNotEmpty()
  @Field()
  startDate: string

  @IsDateString()
  @IsNotEmpty()
  @Field()
  endDate: string

  constructor(input: StatisticsUserInput) {
    super(input)
    if (!input) {
      return
    }
    const { startDate, endDate } = input

    this.startDate = getStartDate(startDate)!
    this.endDate = getEndDate(endDate)!
  }
}

@ObjectType()
export class StatisticsUsersPageLoadResponse extends CommonPageLoadResponse<UserResponse>(
  UserResponse
) {}
