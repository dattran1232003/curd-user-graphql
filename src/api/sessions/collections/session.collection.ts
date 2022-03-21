import { ObjectId } from 'mongodb'
import { ISession } from '../interfaces'
import { Session } from '../schemas'

export async function createSession(session: ISession): Promise<ISession> {
  return Session.create(session)
}

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

export async function getSessionByUserId(
  userId: string | ObjectId
): Promise<ISession | null> {
  if (!ObjectId.isValid(userId)) {
    // TODO: throw error
    return null
  }

  return Session.findOne({
    userId: new ObjectId(userId),
  })
}

export async function getSessionByAccessToken(
  accessToken: string | ObjectId
): Promise<ISession | null> {
  return Session.findOne({
    accessToken,
    restricted: false,
  })
}

export async function invalidSessionById(
  sessionId: ObjectId
): Promise<ISession | null> {
  return Session.findOneAndUpdate(
    {
      _id: sessionId,
    },
    {
      $set: {
        restricted: true,
      },
    },
    {
      new: true,
    }
  )
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

export async function updateSessionLastOnline(
  sessionId: ObjectId,
  lastOnline: Date
): Promise<void> {
  await Session.updateOne(
    {
      _id: sessionId,
    },
    {
      lastOnline,
    }
  )
}
