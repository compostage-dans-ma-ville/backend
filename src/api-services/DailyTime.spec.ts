import { DailyTime } from './DailyTime'

describe('DailyTime', () => {
  describe('fromMinutes', () => {
    it('return no minutes if there are no minutes', () => {
      expect(DailyTime.fromMinutes(0))
        .toEqual([0, 0])
    })

    it('return 1 hour with 60 minutes', () => {
      expect(DailyTime.fromMinutes(60))
        .toEqual([1, 0])
    })

    it('return 1 hour 1 minute with 61 minutes', () => {
      expect(DailyTime.fromMinutes(61))
        .toEqual([1, 1])
    })

    it('return 2 hour 30 minutes with 150 minutes', () => {
      expect(DailyTime.fromMinutes(150))
        .toEqual([2, 30])
    })

    it('return 6 hours with 360 minutes', () => {
      expect(DailyTime.fromMinutes(360))
        .toEqual([6, 0])
    })
  })

  describe('toMinutes', () => {
    it('return no minutes if there are no minutes', () => {
      expect(DailyTime.toMinutes(0, 0))
        .toEqual(0)
    })

    it('return 60 minutes with 1 hour', () => {
      expect(DailyTime.toMinutes(1, 0))
        .toEqual(60)
    })

    it('return 61 minutes with 1 hour 1 minute', () => {
      expect(DailyTime.toMinutes(1, 1))
        .toEqual(61)
    })

    it('return 150 minutes with 2 hour 30 minutes', () => {
      expect(DailyTime.toMinutes(2, 30))
        .toEqual(150)
    })

    it('return 360 minutes with 6 hours', () => {
      expect(DailyTime.toMinutes(6, 0))
        .toEqual(360)
    })

    it('return 1440 minutes with one day', () => {
      expect(DailyTime.toMinutes(24, 0))
        .toEqual(1440)
    })
  })
})
