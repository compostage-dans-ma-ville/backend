import { Injectable } from '@nestjs/common'
import { MINUTES_IN_DAY } from '~/api-services/DailyTime'
import { OpeningSeeder } from '~/seeder/opening.seeder'
import { DailyScheduleSchema } from './DailySchedule.schema'

type DailyScheduleSeed = {
  dayOfWeek: number
  /** If this schedule has multiple openings between 0 and 1 */
  amountOfOpenings: number
}

@Injectable()
export class DailyScheduleSeeder {
  seed(params: DailyScheduleSeed): DailyScheduleSchema {
    const { dayOfWeek, amountOfOpenings } = params
    const openingSeeder = new OpeningSeeder()

    if (amountOfOpenings === 0) {
      return {
        dayOfWeek,
        openings: []
      }
    } if (amountOfOpenings === 1) {
      return {
        dayOfWeek,
        openings: [openingSeeder.seed()]
      }
    }
    return {
      dayOfWeek,
      openings: new Array(amountOfOpenings).fill(undefined).map((_, i) => {
        // time slice each openings so it get a proper time range
        const openMin = i * (MINUTES_IN_DAY / amountOfOpenings)
        const closeMax = (i + 1) * (MINUTES_IN_DAY / amountOfOpenings)
        const openMax = closeMax - 30

        return openingSeeder.seed({
          openMin,
          openMax,
          closeMax
        })
      })
    }
  }
}
