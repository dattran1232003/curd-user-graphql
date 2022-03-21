/** @returns new Date with time reset to 0:00:00 at UTC+0 */
export function getUTCDateWithoutTime(date: number | Date): Date {
  date = new Date(date)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

export const treateAsUTCDate = (d: Date): Date => {
  const utcDate = new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getSeconds()
    )
  )
  return utcDate
}

/**
 * @description
 * - convert time zone to UTC+0
 * - set time to 00:00:00
 */
export const getStartDate = (date: Date | string | number): string | null => {
  if (!isDate(date)) {
    return null
  }
  date = new Date(new Date(date).toISOString().slice(0, -1))

  // set time zone to UTC+0
  const newDate = treateAsUTCDate(date)

  // set UTC hours to 00:00:00 and 0 ms
  newDate.setUTCHours(0, 0, 0, 0)
  return newDate.toISOString()
}

/**
 * @description
 * - convert time zone to UTC+0
 * - set time to 23:59:59
 */
export const getEndDate = (date: Date | string | number): string | null => {
  if (!isDate(date)) {
    return null
  }
  date = new Date(new Date(date).toISOString().slice(0, -1))

  // Set time zone to UTC+0
  const newDate = treateAsUTCDate(date)

  // set UTC hours to 23:59:59 and 0 ms
  newDate.setUTCHours(23, 59, 59, 0)

  return newDate.toISOString()
}

/**
 * @description check whether given value is date or not
 */
export function isDate(date: Date | string | number): boolean {
  if (date instanceof Date) {
    return true
  }
  if (typeof date === 'number') {
    return true
  }
  return !isNaN(Date.parse(date))
}

/**
 * @description check whether start date is anterior to end date
 * @returns true if start date is anterior to end date. Otherwise false
 */
export function isDateAnterior(
  startDate: Date | string,
  endDate: Date | string
): boolean {
  return new Date(startDate)?.getTime() < new Date(endDate)?.getTime()
}
