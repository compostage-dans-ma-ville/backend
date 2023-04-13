/* eslint-disable */ 
import { Site } from '@prisma/client'
import { SiteCompostage } from '../sourceActivateurs'
import { UNPARSABLE } from './const'

const MONTH_ABBR = new Map<string, number>([
  ['janv', 0],
  ['janvier', 0],
  ['fev', 1],
  ['févr', 1],
  ['février', 0],
  ['mars', 2],
  ['avr', 3],
  ['avril', 3],
  ['mai', 4],
  ['jun', 5],
  ['juin', 5],
  ['juin', 5],
  ['juillet', 6],
  ['jui', 6],
  ['juil', 6],
  ['août', 7],
  ['sep', 8],
  ['septembre', 8],
  ['sept', 8],
  ['oct', 9],
  ['octobre', 9],
  ['nov', 10],
  ['novembre', 10],
  ['dec', 11],
  ['déc', 11],
  ['décembre', 12]
])

const NULLABLE = new Set([
  'inconnue',
  'a ouvrir prochainement',
  "en cours d'ouverture"
])
const isMonthUnclear = (m: string) => ['automne', 'été', 'automne', 'ouverture'].includes(m.toLocaleLowerCase())

export const parseLaunchDate = (date: SiteCompostage['date_mise_en_route']): Site['launchDate'] | null | undefined => {
  if (!date) {
    return null
  }
  if (typeof date === 'number') {
    const d = `${date}-01-01`
    return new Date(d)
  }

  const ddmmyyyy = date.match(/(\d+)[/ -](\d+)[/ -](\d{4})/)
  if (ddmmyyyy) {
    const [_, day, month, year] = ddmmyyyy
    return new Date(Number(year), Number(month), Number(day))
  }

  const yyyymmdd = date.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (yyyymmdd) {
    const [_, year, month, day] = yyyymmdd
    return new Date(`${year}-${month}-${day}`)
  }

  const ddmmyy = date.match(/(\d{2})\/(\d{2})\/(\d{2})/)
  if (ddmmyy) {
    const [_, day, month, year] = ddmmyy
    return new Date(`${year}-${month}-${day}`)
  }

  const mmyy = date.match(/(\d{2})\/(\d{4})/)
  if (mmyy) {
    const [_, month, year] = mmyy
    return new Date(`${year}-${month}`)
  }

  const dmyyyy = date.match(/(\d{1})\/(\d{1})\/(\d{4})/)
  if (dmyyyy) {
    const [_, day, month, year] = dmyyyy
    return new Date(`${year}-${month}-${day}`)
  }

  const monthyy = date.match(/([a-zûéèA-Z]+).?[- ](\d{2}|\d{4})/)
  if (monthyy) {
    const [_, monthAbbr, year] = monthyy
    if (isMonthUnclear(monthAbbr)) {
      return null
    }
    const month = MONTH_ABBR.get(monthAbbr.toLowerCase())
    if (month === undefined) {
      console.debug(`parseLaunchDate: uncatched monthAbbr ${monthAbbr.toLowerCase()} in parseLaunchDate`)
      return UNPARSABLE
    }
    return new Date(`${year.toString().padStart(4, '20')}-${month}`)
  }

  if (NULLABLE.has(date.toLowerCase())) {
    return null
  }

  console.debug(`parseLaunchDate: uncatched "${date}"`)
  return undefined
}
