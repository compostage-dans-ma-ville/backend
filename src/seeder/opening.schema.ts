import { Opening } from '@prisma/client'

type OpeningSchemaContent = Omit<Opening, 'DailyScheduleSiteId' | 'DailyScheduleDayOfWeek'>
export class OpeningSchema implements OpeningSchemaContent {
  /** The open in minutes (max 1440) in a day */
  open: number

  /** The close in minutes (max 1440) in a day. close must always be greater than open. */
  close: number
}
