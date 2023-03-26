export const MINUTES_IN_HOUR = 60
export const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR

const divmod = (x: number, y: number): [number, number] => ([Math.floor(x / y), x % y])

export const DailyTime = {
  fromMinutes: (rawMinutes: number): [number, number] => divmod(rawMinutes, MINUTES_IN_HOUR),

  toMinutes: (hours: number, minutes: number): number => hours * MINUTES_IN_HOUR + minutes
}
