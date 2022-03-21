import jwt from 'jsonwebtoken'
import { ISession } from 'src/api/sessions/interfaces'
import { AppConfig } from 'src/config'
import { JWT_ERROR_CODE } from '../constants'
import { IJwtPayLoad } from '../interfaces'

export const generateAccessToken = async (session: ISession) =>
  generateToken(session, false)
export const generateRefreshToken = async (session: ISession) =>
  generateToken(session, true)

export async function generateToken(
  session: ISession,
  isRefreshToken: boolean = false
): Promise<string> {
  return new Promise<string>((res, rej) => {
    jwt.sign(
      {
        sessionId: session._id?.toString(),
        userId: session.userId?.toString(),
      } as IJwtPayLoad,
      AppConfig.JWT_SECRET,
      {
        algorithm: AppConfig.JWT_ALGORITHM,
        expiresIn: isRefreshToken
          ? AppConfig.JWT_REFRESH_TOKEN_EXPIRE_AFTER
          : AppConfig.JWT_ACCESS_TOKEN_EXPIRE_AFTER,
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
