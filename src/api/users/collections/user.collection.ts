import { ObjectId } from 'mongodb'
import { IUser } from '../interfaces'
import { User } from '../schemas'

export async function getUserById(
  userId: string | ObjectId
): Promise<IUser | null> {
  if (!ObjectId.isValid(userId)) {
    // TODO: throw error
    return null
  }

  return User.findOne({
    _id: userId,
  })
}
