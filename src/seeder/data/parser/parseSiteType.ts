import { SiteType } from '@prisma/client'
import { SiteType as RCCSiteType } from '../sourceActivateurs'

export const parseSiteType = (s: RCCSiteType): SiteType | undefined => {
  if (s === 'pied_immeuble') return 'BUILDING_FOOT'
  if (s === 'resto_entreprise') return 'COMPANY'
  if (s === 'scolaire') return 'EDUCATIONAL_INSTITUTION'
  if (s === 'plateforme_communale') return 'ADMINISTRATIVE_INSTITUTION'
  return undefined
}
