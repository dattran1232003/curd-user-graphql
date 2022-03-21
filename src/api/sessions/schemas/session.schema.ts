import { ObjectId } from 'mongodb'
import { model, Schema } from 'mongoose'
import { COLLECTION_NAME } from 'src/common/constants'
import { AppConfig } from 'src/config'
import { ISession } from '../interfaces'

export const SessionSchema = new Schema<ISession>(
  {
    accessToken: {
      type: String,
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: COLLECTION_NAME.USER_MODEL,
    },
    restricted: {
      type: Boolean,
      default: false,
    },
    isUserDeleted: {
      type: Boolean,
      default: false,
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
export const Session = model(
  COLLECTION_NAME.SESSION_MODEL,
  SessionSchema,
  COLLECTION_NAME.SESSION_MODEL
)
