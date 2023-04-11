import { Prisma, Site } from '@prisma/client'
import { SiteCompostage } from './sourceActivateurs'
import sourceActivateurs from './sourceActivateurs.json'
import * as Validator from 'validatorjs'
import { parseLaunchDate } from './parser/parseLaunchDate'
import { parseName } from './parser/parseName'
import { parseIsPublic } from './parser/parseIsPublic'
import { parseConditionAccess } from './parser/parseConditionAccess'
import { UNPARSABLE } from './parser/const'
import { Result, isErr, isOk } from './parser/Result'
import { parseAddress } from './parser/parseAdress'
import { UseFilters } from '@nestjs/common'

const rules: Validator.Rules = {
  boundedBy: 'present',
  geometry: {
    Point: {
      coordinates: 'string'
    }
  },
  id_site: 'integer',
  libelle: 'present',
  type: 'string',
  adresse: 'string',
  ville: 'string',
  code_postal: 'integer',
  is_public: 'in:non,oui',
  is_signataire_charte: 'present',
  quantite_traitee: 'string',
  nb_contributeurs: 'integer',
  nb_repas_annuel: 'integer',
  type_materiel: 'string', // TODO: clarify this complexity
  // TODO: exploitant export json
  exploitant_nom: 'string', // sometimes prefixed with "Référent(s): "
  exploitant_structure: 'string',
  exploitant_contact: 'string', // "email / phone" | "Name phone" | "email / phone" | string
  contact_referent: 'string|required', // same mess as exploitant_contact
  acteur: 'string', // also a mess
  date_maj_fiche: 'date',
  date_mise_en_route: 'date',
  photo: 'present',
  condition_acces: 'present',
  fonctionnement_site: 'present',
  nom_dept: 'string',
  code_dept: 'integer',
  nom_reg: 'string',
  code_reg: 'integer'
}

type ParseResult<T, U> = {
  valid: T[],
  invalid: U[]
} 

export type ParsedError = { id: number | string, reason: string }


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSites = (): SiteCompostage[] => (sourceActivateurs as any)
  .FeatureCollection.featureMember
  .map((f: { v_site_compostage_dept_3857: SiteCompostage}) => f.v_site_compostage_dept_3857)

type ParsedSite = Omit<Site, 'id' | 'createdAt' | 'updatedAt' | 'addressId' | 'organizationId'>
const parseSite = (site: SiteCompostage): Result<ParsedSite, ParsedError> => {
  const name = parseName(site.libelle)
  const launchDate = parseLaunchDate(site.date_mise_en_route) ?? null
  const isPublic = parseIsPublic(site.is_public)
  // const description = site.fonctionnement_site ?? null
  const accessConditions = parseConditionAccess(site.condition_acces) ?? null

  if(name === UNPARSABLE) {
    return { err: { id: site.id_site, reason: 'Name is not found.' } }
  }

  if(isPublic === UNPARSABLE) {
    return { err: { id: site.id_site, reason: 'isPublic is unknown.' }}
  }

  return {
    ok: {
      name,
      launchDate,
      isPublic,
      description: null,
      accessConditions
    }
  }
}


const sites: ParseResult<Prisma.SiteCreateInput, ParsedError> = {
  valid: [],
  invalid: []
}
getSites().forEach(site => {
  const parsedSite = parseSite(site)
  if(isErr(parsedSite)) { sites.invalid.push(parsedSite.err); return }

  const address = parseAddress(site)
  if(isErr(address)) { sites.invalid.push(address.err); return }

  sites.valid.push({
    ...parsedSite.ok,
    Address: { create: address.ok }
  })
})

console.log(sites.valid)
