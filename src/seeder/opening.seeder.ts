import { Injectable } from '@nestjs/common'
import { MINUTES_IN_DAY } from '~/api-services/DailyTime'
import { randomInRange } from '~/utils/random'
import { OpeningSchema } from './opening.schema'

type OpeningSeedParams = {
  openMin?: number
  openMax?: number
  closeMax?: number
}

@Injectable()
export class OpeningSeeder {
  seed(params: OpeningSeedParams = {}): OpeningSchema {
    const { openMin, openMax, closeMax } = params

    const open = randomInRange(openMin ?? 0, openMax ?? (MINUTES_IN_DAY - 61))
    const close = randomInRange(open, closeMax ?? (MINUTES_IN_DAY - 30))

    return {
      open,
      close
    }
  }
}
