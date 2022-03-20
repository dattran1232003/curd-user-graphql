import jwt from 'jsonwebtoken'
import { IUser } from 'src/api/users/interfaces'
import { JWT_ERROR_CODE } from '../constants'
import { IJwtPayLoad } from '../interfaces'

export async function generateToken(
  user: IUser,
  isRefreshToken: boolean = false
): Promise<string> {
  return new Promise<string>((res, rej) => {
    jwt.sign(
      {
        email: user.email,
        username: user.username,
        userType: user.userType,
      } as IJwtPayLoad,
      process.env.JWT_SECRET as string,
      {
        algorithm: 'HS256',
        expiresIn: isRefreshToken ? '1h' : '30 days',
      },
      (err, jwtToken) => {
        if (jwtToken) {
          res(jwtToken)
        } else if (err) {
          rej(err)
        }
      }
    )
  })
}

export async function checkToken(token: string): Promise<IJwtPayLoad> {
  return new Promise<IJwtPayLoad>((res, rej) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err, decoded): void => {
        if (decoded) {
          res(decoded as IJwtPayLoad)
        } else if (err) {
          rej(err.message as JWT_ERROR_CODE)
        }
      }
    )
  })
}
