import { ObjectId } from 'mongodb'
import { getUserIdsForStatisticsPageLoadQuery } from 'src/api/sessions/collections'
import { getCountMongoResult } from 'src/common/functions/mongo-result.common'
import { ICountMongo } from 'src/common/interfaces'
import { CommonPageLoadInput } from 'src/common/types'
import { Arg, Authorized, Query, Resolver } from 'type-graphql'
import { getNewUsersPageLoadQuery, getUserById } from '../collections'
import { USER_TYPE } from '../constants'
import { IUser } from '../interfaces'
import {
  GetNewUsersPageLoadResponse,
  StatisticsUserInput,
  StatisticsUsersPageLoadResponse,
  UserResponse,
} from '../types'

@Resolver()
export class StatisticsUserResolver {
  @Query(_ => GetNewUsersPageLoadResponse)
  @Authorized(USER_TYPE.ADMIN)
  async getNewUsers(
    @Arg('getNewUsersPageLoadInput')
    getNewUsersPageLoadInput: CommonPageLoadInput
  ): Promise<GetNewUsersPageLoadResponse> {
    const { skip, limit } = getNewUsersPageLoadInput

    const [users, countMongo] = await Promise.all([
      getNewUsersPageLoadQuery<IUser>(skip, limit, false),
      getNewUsersPageLoadQuery<ICountMongo>(skip, limit, true),
    ])
    const totalItems = getCountMongoResult(countMongo)
    const usersResponse = await Promise.all(
      users.map(async user => new UserResponse(user))
    )

    return {
      totalItems,
      items: usersResponse,
    } as GetNewUsersPageLoadResponse
  }

  @Query(_ => StatisticsUsersPageLoadResponse)
  async statisticsUsers(
    @Arg('statisticsUsersPageLoadInput')
    input: StatisticsUserInput
  ): Promise<StatisticsUsersPageLoadResponse> {
    input = new StatisticsUserInput(input)
    const { skip, limit } = input
    const startDate = new Date(input.startDate)
    const endDate = new Date(input.endDate)

    const [listUserIds, countMongo] = await Promise.all([
      getUserIdsForStatisticsPageLoadQuery<{ _id: ObjectId }>(
        skip,
        limit,
        false,
        startDate,
        endDate
      ),
      getUserIdsForStatisticsPageLoadQuery<ICountMongo>(
        skip,
        limit,
        true,
        startDate,
        endDate
      ),
    ])
    const totalItems = getCountMongoResult(countMongo)

    const users = await Promise.all(
      listUserIds.map(async ({ _id: userId }) => {
        return getUserById(userId)
      })
    )
    const usersResponse = await Promise.all(
      users.map(async user => new UserResponse(user!))
    )

    return {
      totalItems,
      items: usersResponse,
    } as StatisticsUsersPageLoadResponse
  }
}
