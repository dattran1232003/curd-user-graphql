declare namespace Express {
  export interface Request {
    user?: import('src/api/users/interfaces/user.interface').IUser
  }
}
