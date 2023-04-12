
import type { Result } from './Result'
import type { SiteCompostage } from '../sourceActivateurs'
import type { ParsedError } from '../ActivateurSeeder'
import { Prisma } from '@prisma/client'

export const parseDailySchedule = (site: SiteCompostage): Result<Prisma.SiteCreateInput['DailySchedules'], ParsedError> => {
  const { fonctionnement_site } = site

  const dailySchedules = fonctionnement_site.match(/24h?\/24/) ? new Array(7).fill(undefined).map((_, i) => ({
    dayOfWeek: i, openings: { createMany: { data: [] } }
  })): []

  return { ok: { 
      create: dailySchedules
  } }
}
