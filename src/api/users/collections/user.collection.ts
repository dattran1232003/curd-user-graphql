import { ObjectId } from 'mongodb'
import { MILLISECONDS } from 'src/common/constants'
import { getUTCDateWithoutTime } from 'src/common/functions'
import { ICountMongo } from 'src/common/interfaces'
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

/**
 * @description Get users that:
 * - is created within the last 3 days
 */
export async function getNewUsersPageLoadQuery<T extends IUser | ICountMongo>(
  skip: number = 0,
  limit: number = 10,
  isCount?: boolean
): Promise<Array<T>> {
  return User.aggregate<T>([
    {
      $match: {
        createdAt: {
          $gte: getUTCDateWithoutTime(Date.now() - MILLISECONDS.THREE_DAYS),
        },
      },
    },
    ...(isCount
      ? [
          {
            $count: 'count',
          },
        ]
      : [
          {
            $sort: {
              createdAt: -1 as -1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ]),
  ])
}
