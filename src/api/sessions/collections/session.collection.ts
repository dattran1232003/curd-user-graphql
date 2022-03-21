import { ObjectId } from 'mongodb'
import { ISession } from '../interfaces'
import { Session } from '../schemas'

export async function getSessionById(
  sessionId: ObjectId | string
): Promise<ISession | null> {
  if (!ObjectId.isValid(sessionId)) {
    // TODO: throw error
    return null
  }

  return Session.findOne({
    _id: new ObjectId(sessionId),
  })
}

export async function createSession(session: ISession): Promise<ISession> {
  return Session.create(session)
}
export async function updateSessionAccessToken(
  sessionId: ObjectId,
  accessToken: string
): Promise<void> {
  await Session.updateOne(
    {
      _id: sessionId,
    },
    {
      $set: {
        accessToken,
      },
    }
  )
}
