import type { Result } from './Result'
import type { SiteCompostage } from '../sourceActivateurs'
import type { ParsedError } from '../ActivateurSeeder'
import { Prisma } from '@prisma/client'
import proj4 from 'proj4'

const sourceCoordType = proj4.Proj('EPSG:3857')
const destCoordType = proj4.Proj('WGS84')

const capitalize = (s: string) => s.replace(/\b\w/g, x => x.toUpperCase())

export const parseAddress = (site: SiteCompostage): Result<Prisma.AddressCreateInput, ParsedError> => {
  const { coordinates } = site.geometry?.Point ?? { coordinates: '' }
  const coords = coordinates.split(',').map(Number)
  if(coords.length < 2) return  { err: { id: site.id_site, reason: `The coordinates ${coordinates} are invalid.` } }
  const { x: longitude, y: latitude } = proj4.transform(sourceCoordType, destCoordType, coords) as { x: number, y: number }
  const city = capitalize(site.ville.toString().trim()?.toLowerCase() ?? '')
  if(!city) {
    return { err: { id: site.id_site, reason: `The city "${site.ville}" has an invalid format.` } }
  }
  
  if(!site.adresse) return { err: { id: site.id_site, reason: `The adresse "${site.adresse}" has an invalid format.` } }
  const street = site.adresse.match(/(\d+)[ ,](\D+)/g)?.at(-1)
  if(!street) return { err: { id: site.id_site, reason: `The adresse "${site.adresse}" has an invalid format.` } }
  const [_, houseNumber, rawStreetName] = [...(street.match(/(\d+)[ ,](\D+)/) ?? [])]
  if(!houseNumber) {
    return  { err: { id: site.id_site, reason: `The houseNumber "${site.adresse}" has an invalid format.` } }
  }

  const streetName = rawStreetName.trim()
  if(streetName.length < 3 || streetName.includes('-')) {
    return { err: { id: site.id_site, reason: `The streetName "${site.adresse}" has an invalid format.` } }
  }

  return { ok: { longitude, latitude, houseNumber, streetName, zipCode: site.code_postal, city } }
}
