import { ISession } from 'src/api/sessions/interfaces'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class SignOutResponse {
  @Field(_ => ID)
  id: string

  @Field()
  userId: string

  @Field()
  accessToken?: string

  @Field()
  restricted: boolean

  constructor(session: ISession) {
    if (!session) {
      return
    }
    this.id = session.id || session._id?.toString() || null
    this.userId = session.userId?.toString()
    this.accessToken = session.accessToken
    this.restricted = session.restricted
  }
}
