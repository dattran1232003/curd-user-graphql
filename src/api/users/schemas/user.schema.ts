import { Model, model, Schema } from 'mongoose'
import { COLLECTION_NAME } from 'src/common/constants'
import { USER_TYPES_LIST } from '../constants'
import { IUser } from '../interfaces'

export const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    userType: {
      type: String,
      enum: USER_TYPES_LIST,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
export const User = model(
  COLLECTION_NAME.USER_MODEL,
  UserSchema,
  COLLECTION_NAME.USER_MODEL
)
