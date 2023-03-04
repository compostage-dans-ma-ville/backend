import { WeekTime } from './weekTime'

describe('WeekTime', () => {
  describe('fromMinutes', () => {
    it('return no minutes if there are no minutes', () => {
      expect(WeekTime.fromMinutes(0))
        .toEqual({ days: 0, hours: 0, minutes: 0 })
    })

    it('return 1 hour with 60 minutes', () => {
      expect(WeekTime.fromMinutes(60))
        .toEqual({ days: 0, hours: 1, minutes: 0 })
    })

    it('return 1 hour 1 minute with 61 minutes', () => {
      expect(WeekTime.fromMinutes(61))
        .toEqual({ days: 0, hours: 1, minutes: 1 })
    })

    it('return 2 hour 30 minutes with 150 minutes', () => {
      expect(WeekTime.fromMinutes(150))
        .toEqual({ days: 0, hours: 2, minutes: 30 })
    })

    it('return 6 hours with 360 minutes', () => {
      expect(WeekTime.fromMinutes(360))
        .toEqual({ days: 0, hours: 6, minutes: 0 })
    })

    it('return 1 day with 1440 minutes', () => {
      expect(WeekTime.fromMinutes(1440))
        .toEqual({ days: 1, hours: 0, minutes: 0 })
    })

    it('return 4 days with 5760 minutes', () => {
      expect(WeekTime.fromMinutes(5760))
        .toEqual({ days: 4, hours: 0, minutes: 0 })
    })

    it('return 7 days with 10080 minutes', () => {
      expect(WeekTime.fromMinutes(10080))
        .toEqual({ days: 7, hours: 0, minutes: 0 })
    })

    it('return 8 days with 11520 minutes', () => {
      expect(WeekTime.fromMinutes(11520))
        .toEqual({ days: 8, hours: 0, minutes: 0 })
    })

    it('return -1 day -1 hour -1 minute with -1 minute', () => {
      expect(WeekTime.fromMinutes(-1))
        .toEqual({ days: -1, hours: -1, minutes: -1 })
    })
  })

  describe('toMinutes', () => {
    it('return no minutes if there are no minutes', () => {
      expect(WeekTime.toMinutes({ days: 0, hours: 0, minutes: 0 }))
        .toEqual(0)
    })

    it('return 60 minutes with 1 hour', () => {
      expect(WeekTime.toMinutes({ days: 0, hours: 1, minutes: 0 }))
        .toEqual(60)
    })

    it('return 61 minutes with 1 hour 1 minute', () => {
      expect(WeekTime.toMinutes({ days: 0, hours: 1, minutes: 1 }))
        .toEqual(61)
    })

    it('return 150 minutes with 2 hour 30 minutes', () => {
      expect(WeekTime.toMinutes({ days: 0, hours: 2, minutes: 30 }))
        .toEqual(150)
    })

    it('return 360 minutes with 6 hours', () => {
      expect(WeekTime.toMinutes({ days: 0, hours: 6, minutes: 0 }))
        .toEqual(360)
    })

    it('return 1440 minutes with one day', () => {
      expect(WeekTime.toMinutes({ days: 1, hours: 0, minutes: 0 }))
        .toEqual(1440)
    })

    it('return 5760 minutes with 4 days', () => {
      expect(WeekTime.toMinutes({ days: 4, hours: 0, minutes: 0 }))
        .toEqual(5760)
    })

    it('return 10080 minutes with 7 days', () => {
      expect(WeekTime.toMinutes({ days: 7, hours: 0, minutes: 0 }))
        .toEqual(10080)
    })

    it('return 11520 minutes with 8 days', () => {
      expect(WeekTime.toMinutes({ days: 8, hours: 0, minutes: 0 }))
        .toEqual(11520)
    })

    it('return -1 with -1 minute', () => {
      expect(WeekTime.toMinutes({ days: 0, hours: 0, minutes: -1 }))
        .toEqual(-1)
    })
  })
})
