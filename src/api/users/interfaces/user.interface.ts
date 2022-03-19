import { BaseDocument } from 'src/common/interfaces'
import { USER_TYPE } from '../constants'

export interface IUser extends BaseDocument {
  email: string
  userType: USER_TYPE
  username: string
  password: string
}
