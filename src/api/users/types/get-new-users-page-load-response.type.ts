import { CommonPageLoadResponse } from 'src/common/types'
import { ObjectType } from 'type-graphql'
import { UserResponse } from './user-response.type'

@ObjectType()
export class GetNewUsersPageLoadResponse extends CommonPageLoadResponse<UserResponse>(
  UserResponse
) {}
