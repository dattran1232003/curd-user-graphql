import jwt from 'jsonwebtoken'
import { IUser } from 'src/api/users/interfaces'
import { AppConfig } from 'src/config'
import { JWT_ERROR_CODE } from '../constants'
import { IJwtPayLoad } from '../interfaces'

export async function generateToken(
  user: IUser,
  isRefreshToken: boolean = false
): Promise<string> {
  return new Promise<string>((res, rej) => {
    jwt.sign(
      {
        userId: user._id?.toString(),
        email: user.email,
        username: user.username,
        userType: user.userType,
      } as IJwtPayLoad,
      AppConfig.JWT_SECRET,
      {
        algorithm: AppConfig.JWT_ALGORITHM,
        expiresIn: isRefreshToken ? '30d' : '1h',
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
    jwt.verify(token, AppConfig.JWT_SECRET, (err, decoded): void => {
      if (decoded) {
        res(decoded as IJwtPayLoad)
      } else if (err) {
        rej(err.message as JWT_ERROR_CODE)
      }
    })
  })
}
