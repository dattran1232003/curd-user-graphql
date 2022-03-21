import { ObjectId } from 'mongodb'
import { IBaseDocument } from 'src/common/interfaces'

export interface ISession extends IBaseDocument {
  userId: ObjectId
  accessToken: string
  restricted: boolean
  isUserDeleted: boolean
}
