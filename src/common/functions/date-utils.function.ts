/** @returns new Date with time reset to 0:00:00 at UTC+0 */
export function getUTCDateWithoutTime(date: number | Date): Date {
  date = new Date(date)
  date.setUTCHours(0, 0, 0, 0)
  return date
}
