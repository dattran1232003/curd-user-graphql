/** map jsonwebtoken error message to enum member */
export enum JWT_ERROR_CODE {
  JWT_NOT_PROVIDED = `jwt must be provided`,
  JWT_IS_NOT_STRING = `jwt must be a string`,
  JWT_MALFORMED = `jwt malformed`,
  JWT_EXPIRED = `jwt expired`,

  INVALID_TOKEN = `invalid token`,
}
export const JWT_ERROR_CODES_LIST = Object.values(JWT_ERROR_CODE)
