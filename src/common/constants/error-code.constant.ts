import { registerEnumType } from 'type-graphql'

export enum ERROR_CODE {
  // Authentication errors
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  WRONG_ROLE = 'WRONG_ROLE',
}
registerEnumType(ERROR_CODE, { name: 'ERROR_CODE' })
export const ERROR_CODE_LIST = Object.values(ERROR_CODE)
