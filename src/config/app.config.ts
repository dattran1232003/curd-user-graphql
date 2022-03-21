import dotenv from 'dotenv'
import { Algorithm } from 'jsonwebtoken'

dotenv.config()

export class AppConfig {
  static readonly PORT: number = Number(process.env.PORT?.trim()) || 5000
  static readonly MONGO_URI: string = process.env.MONGO_URI?.trim() || ''
  static readonly JWT_SECRET: string = process.env.JWT_SECRET?.trim() as string
  static readonly JWT_ALGORITHM: Algorithm =
    (process.env.JWT_ALGORITHM?.trim() as Algorithm) || 'HS256'

  static readonly JWT_REFRESH_TOKEN_EXPIRE_AFTER = '30d'
  static readonly JWT_ACCESS_TOKEN_EXPIRE_AFTER = '1h'
}
