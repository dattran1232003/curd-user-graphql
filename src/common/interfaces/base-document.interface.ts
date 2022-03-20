import { Document } from 'mongoose'

export interface IBaseDocument extends Document {
  /* timestamp fields */
  createdAt: Date
  updatedAt: Date
}
