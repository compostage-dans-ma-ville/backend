/* eslint-disable */ 
import type { Result } from './Result'
import type { SiteCompostage } from '../sourceActivateurs'
import type { ParsedError } from '../ActivateurSeeder'
import { Prisma } from '@prisma/client'

const parseExploitantContact = (s: string) => {
  if (typeof s !== 'string') return
  const matched = s.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)
  return matched?.at(0)
}

export const parseContact = (site: SiteCompostage):
  Result<Prisma.OrganizationCreateInput, ParsedError> => {
  const data = site.exploitant_nom.includes('@') ? {
    name: site.exploitant_structure,
    email: site.exploitant_nom,
    referent: site.contact_referent
  } : {
    name: site.exploitant_nom,
    email: parseExploitantContact(site.exploitant_contact) ?? site.contact_referent,
    referent: site.contact_referent
  }
  if (!data.name) {
    const [name, domain] = data.email.split('@')
    data.name = name !== 'contact' ? name : domain
  }

  if (!data.email.includes('@')) return { err: { id: site.id_site, reason: `The organization email ${data.email} is invalid.` } }

  const members: Prisma.OrganizationCreateInput['members'] = {
    connectOrCreate: {
      create: {
        firstname: data.name,
        lastname: '',
        password: '123456',
        email: data.email
      },
      where: {
        email: data.email
      }
    }
  }

  return { ok: { name: data.name, members } }
}
