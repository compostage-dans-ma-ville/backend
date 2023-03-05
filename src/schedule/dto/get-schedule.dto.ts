type Closed = null

export type DaySchedule = Closed | {
  open: string
  close: string
}[]

/**
 * A 7-tuple for the seven days of the week.
 * The index 0 is monday.
 */
export type GetScheduleDto = [
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule
]
