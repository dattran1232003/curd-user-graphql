import { Schema, model } from 'mongoose'
import { IUser } from 'src/api/users/interfaces'
import { COLLECTION_NAME } from 'src/common/constants'
import { BaseDocument } from 'src/common/interfaces'

export interface IRefreshToken extends BaseDocument {
  refreshToken: string
  userId: string
  expired: Date

  /** using for populate */
  user?: IUser
}

export const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    refreshToken: {
      type: String,
      unique: true,
    },
    userId: {
      type: String,
    },
    expired: {
      type: Date,
      index: {
        expires: `30 days`,
      },
    },
  },
  { timestamps: true }
)
export const RefreshToken = model(
  COLLECTION_NAME.REFRESH_TOKEN_MODEL,
  RefreshTokenSchema
)

/**
 * Indexes:
 *  expired
 *  refreshToken
 *  userId
 */
RefreshTokenSchema.index({
  refreshToken: 1,
  userId: 1,
  expired: -1,
})
