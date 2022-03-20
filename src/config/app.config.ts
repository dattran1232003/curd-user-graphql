import dotenv from 'dotenv'
import { Algorithm } from 'jsonwebtoken'

dotenv.config()

export class AppConfig {
  static readonly PORT: number = Number(process.env.PORT?.trim()) || 5000
  static readonly MONGO_URI: string = process.env.MONGO_URI?.trim() || ''
  static readonly JWT_SECRET: string = process.env.JWT_SECRET?.trim() as string
  static readonly JWT_ALGORITHM: Algorithm =
    (process.env.JWT_ALGORITHM?.trim() as Algorithm) || 'HS256'
}
