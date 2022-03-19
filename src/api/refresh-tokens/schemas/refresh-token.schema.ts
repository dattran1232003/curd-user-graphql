import { model, Schema } from 'mongoose'
import { COLLECTION_NAME } from 'src/common/constants'
import { IRefreshToken } from '../interfaces'

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
      default: Date.now,
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
