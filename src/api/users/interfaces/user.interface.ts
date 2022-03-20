import { IBaseDocument } from 'src/common/interfaces'
import { USER_TYPE } from '../constants'

export interface IUser extends IBaseDocument {
  email: string
  userType: USER_TYPE
  username: string
  password: string
}
