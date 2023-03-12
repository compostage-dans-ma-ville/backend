import { Opening, Prisma } from '@prisma/client'

type OpeningSchemaContent = Omit<Opening, 'DailyScheduleSiteId' | 'DailyScheduleDayOfWeek'>
export class OpeningSchema implements OpeningSchemaContent {
  /**
   * the day of the week between 0 and 6
   * 0 is Monday
  */
  dayOfWeek: number

  /** The open in minutes (max 1440) in a day */
  open: number
  /** The close in minutes (max 1440) in a day. close must always be greater than open. */
  close: number
}
