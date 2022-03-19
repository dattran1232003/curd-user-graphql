import { Schema, Model, model } from 'mongoose'
import { COLLECTION_NAME } from 'src/common/constants'
import { USER_TYPES_LIST } from '../constants'
import { IUser } from '../interface'

export const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    userType: {
      type: String,
      enum: USER_TYPES_LIST,
    },
    password: { type: String },
  },
  { timestamps: true }
)
export const User = model(COLLECTION_NAME.USER_MODEL, UserSchema)
