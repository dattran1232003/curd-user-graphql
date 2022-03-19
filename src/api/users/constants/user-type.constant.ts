import { registerEnumType } from 'type-graphql'

export enum USER_TYPE {
  ADMIN = 'admin',
  BUYER = 'buyer',
  MERCHANT = 'merchant',
}
export const USER_TYPES_LIST = Object.values(USER_TYPE)
registerEnumType(USER_TYPE, { name: 'USER_TYPE' })
