import { ObjectId } from 'mongodb'
import { model, Schema } from 'mongoose'
import { COLLECTION_NAME } from 'src/common/constants'
import { AppConfig } from 'src/config'
import { IRefreshToken } from '../interfaces'

export const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    refreshToken: {
      type: String,
      unique: true,
    },
    userId: {
      type: ObjectId,
      ref: COLLECTION_NAME.USER_MODEL,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: `${AppConfig.JWT_REFRESH_TOKEN_EXPIRE_AFTER}`,
      },
    },
  },
  {
    timestamps: true,
  }
)
export const RefreshToken = model(
  COLLECTION_NAME.REFRESH_TOKEN_MODEL,
  RefreshTokenSchema,
  COLLECTION_NAME.REFRESH_TOKEN_MODEL
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
  createdAt: -1,
})
