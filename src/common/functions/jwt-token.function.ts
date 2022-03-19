import jwt from 'jsonwebtoken'
import { IUser } from 'src/api/users/interfaces'
import { JWT_ERROR_CODE } from '../constants'

export async function generateToken(
  user: IUser,
  isRefreshToken: boolean = false
): Promise<string> {
  const jwtToken = jwt.sign(
    {
      email: user.email,
      username: user.username,
      userType: user.userType,
    },
    process.env.JWT_SECRET as string,
    {
      algorithm: 'HS256',
      expiresIn: isRefreshToken ? '1h' : '30 days',
    }
  )

  return jwtToken
}

export async function checkToken<T>(
  token: string
): Promise<T | JWT_ERROR_CODE> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    return decoded as T
  } catch (e) {
    return e.message as JWT_ERROR_CODE
  }
}
