import { ICountMongo } from '../interfaces'

export function getCountMongoResult(countMongo: ICountMongo[]): number {
  if (!countMongo || !countMongo.length) {
    return 0
  }
  const [{ count }] = countMongo
  return count ?? 0
}
