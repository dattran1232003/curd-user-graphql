import { AuthenticationError, ForbiddenError } from 'apollo-server-core'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { USER_TYPE } from 'src/api/users/constants'
import { User } from 'src/api/users/schemas'
import { AuthChecker } from 'type-graphql'
import { ERROR_CODE, JWT_ERROR_CODE } from '../constants'
import { checkToken } from '../functions'

export const jwtAuthChecker: AuthChecker<{ req: Request }, USER_TYPE> = async (
  { root, args, context, info },
  userTypes = []
): Promise<boolean> => {
  const accessToken = (context?.req?.headers?.authorization || '')
    .split('Bearer ')[1]
    .trim()

  if (!accessToken) {
    throw new AuthenticationError(ERROR_CODE.INVALID_TOKEN)
  }

  try {
    const profile = await checkToken(accessToken)

    const user = await User.findOne({
      _id: new ObjectId(profile.userId),
    })

    if (!user) {
      throw JWT_ERROR_CODE.INVALID_TOKEN
    }

    if (userTypes.length) {
      const { userType } = user

      if (!userTypes.includes(userType)) {
        throw ERROR_CODE.WRONG_ROLE
      }
    }
    context.req.user = user
    return true
  } catch (e) {
    switch (e) {
      case JWT_ERROR_CODE.JWT_EXPIRED:
        throw new AuthenticationError(ERROR_CODE.TOKEN_EXPIRED)
      case JWT_ERROR_CODE.INVALID_TOKEN:
        throw new AuthenticationError(ERROR_CODE.INVALID_TOKEN)

      default:
        throw new ForbiddenError(e)
    }
  }
}
