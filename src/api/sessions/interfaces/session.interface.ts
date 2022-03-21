import { ObjectId } from 'mongodb'
import { IBaseDocument } from 'src/common/interfaces'

export interface ISession extends IBaseDocument {
  userId: ObjectId
  accessToken: string
  restricted: boolean
  isUserDeleted: boolean
  /**
   * @description update when user sign-in/sign-up/check-token
   */
  lastOnline: Date
}
