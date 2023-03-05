interface StructuredWeekTime {
  days: number
  hours: number
  minutes: number
}

export const MINUTES_IN_HOUR = 60
export const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR

const divmod = (x: number, y: number): [number, number] => ([Math.floor(x / y), x % y])

export const WeekTime = {
  /**
   * Expects a positive integer to return a StructuredWeekTime.
   * behave inconsistently with negative minutes.
   * */
  fromMinutes: (rawMinutes: number): StructuredWeekTime => {
    const [days, restDay] = divmod(rawMinutes, MINUTES_IN_DAY)
    const [hours, minutes] = divmod(restDay, MINUTES_IN_HOUR)

    return {
      days,
      hours,
      minutes
    }
  },

  toMinutes: ({ days, hours, minutes }: StructuredWeekTime): number => {
    return days * MINUTES_IN_DAY + hours * MINUTES_IN_HOUR + minutes
  }
}
