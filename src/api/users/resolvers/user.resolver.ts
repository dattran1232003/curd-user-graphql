import { Query } from 'type-graphql'

export class UserResolver {
  @Query()
  hello(): string {
    return 'hello user'
  }
}
