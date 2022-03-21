import { getCountMongoResult } from 'src/common/functions/mongo-result.common'
import { ICountMongo } from 'src/common/interfaces'
import { CommonPageLoadInput } from 'src/common/types'
import { Arg, Authorized, Query, Resolver } from 'type-graphql'
import { getNewUsersPageLoadQuery } from '../collections'
import { USER_TYPE } from '../constants'
import { IUser } from '../interfaces'
import { GetNewUsersPageLoadResponse, UserResponse } from '../types'

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
}
