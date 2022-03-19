import { Document } from 'mongoose'

export interface BaseDocument extends Document {
  /* timestamp fields */
  createdAt: Date
  updatedAt: Date
}
