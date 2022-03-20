import { IUser } from 'src/api/users/interfaces'
import { createParamDecorator } from 'type-graphql'

/** must be used along with @Authorized() decorator */
export function CurrentUser(): ParameterDecorator {
  return createParamDecorator<{ req: Express.Request }>(({ context }) => {
    const user = context.req.user as IUser
    return user
  })
}
