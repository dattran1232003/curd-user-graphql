import { CurrentUser } from 'src/common/decorators'
import { Authorized, Query, Resolver } from 'type-graphql'
import { IUser } from '../interfaces'

@Resolver()
export class UserResolver {
  @Query()
  @Authorized()
  hello(@CurrentUser() user: IUser): string {
    return `hello ${user.username}`
  }
}
