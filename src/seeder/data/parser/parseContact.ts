import type { Result } from './Result'
import type { SiteCompostage } from '../sourceActivateurs'
import type { ParsedError } from '../ActivateurSeeder'
import { Prisma } from '@prisma/client'

const parseExploitantContact = (s: string) => {
    if(typeof s !== 'string') return
    const matched = s.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)
    return matched?.at(0)
}

export const parseContact = (site: SiteCompostage): Result<Prisma.OrganizationCreateInput, ParsedError> => {
    const data = site.exploitant_nom.includes('@') ? {
        name: site.exploitant_structure,
        email: site.exploitant_nom,
        referent: site.contact_referent
    } : {
        name: site.exploitant_nom,
        email: parseExploitantContact(site.exploitant_contact),
        referent: site.contact_referent
    }

    if(!data.name) return { err: { id: site.id_site, reason: `The organization name ${data.name} is invalid.` } }

    const members: Prisma.OrganizationCreateInput['members'] = [{
        connectOrCreate: {
            create: {
                firstname: site.contact_referent,
                email: data.email
            },
            where: {
                email: data.email
            }
        }
    }]
    return { ok: { name: data.name, members } }
}
