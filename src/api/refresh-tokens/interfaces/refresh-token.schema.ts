import { IUser } from 'src/api/users/interfaces'
import { IBaseDocument } from 'src/common/interfaces'

export interface IRefreshToken extends IBaseDocument {
  refreshToken: string
  userId: string
  expired: Date

  /** using for populate */
  user?: IUser
}
