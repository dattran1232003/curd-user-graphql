import { registerEnumType } from 'type-graphql'

export enum USER_TYPE {
  ADMIN = 'admin',
  BUYER = 'buyer',
  MERCHANT = 'merchant',
}
registerEnumType(USER_TYPE, { name: 'USER_TYPE' })
export const USER_TYPES_LIST = Object.values(USER_TYPE)
