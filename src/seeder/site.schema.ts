import { Address, Site, SiteType } from '@prisma/client'
import { Factory } from 'nestjs-seeder'
import { TREATED_WASTE_VALUES } from '~/site/dto/GetTreatedWaste.dto'

export class SiteSchema implements Site {
  id: number

  createdAt: Date

  updatedAt: Date

  launchDate: Date

  @Factory(faker => faker?.animal.rabbit())
    name: string

  @Factory(faker => faker?.lorem.paragraphs(5))
    description: string | null

  @Factory(() => Math.random() > 0.2)
    isPublic: boolean

  @Factory(faker => faker?.helpers.objectValue(SiteType))
    type: SiteType

  @Factory(faker => Math.random() > 0.5 ? faker?.lorem.paragraphs(3) : undefined)
    accessConditions: string

  avatar: string | null

  @Factory(faker => ({
    houseNumber: faker?.address.buildingNumber(),
    streetName: faker?.address.street(),
    zipCode: Number(faker?.address.zipCode('#####')),
    city: faker?.address.cityName(),
    longitude: Number(faker?.address.longitude()),
    latitude: Number(faker?.address.latitude())
  }))
    address: Address

  addressId: number

  organizationId: number | null

  @Factory(
    faker => Math.random() > 0.25
      ? faker?.helpers.arrayElement(TREATED_WASTE_VALUES.map(x => x.id))
      : null
  )
    treatedWaste: number | null

  @Factory(
    faker => Math.random() > 0.25
      ? faker?.random.numeric(2)
      : null
  )
    householdsAmount: number | null

  @Factory(
    faker => Math.random() > 0.25
      ? faker?.internet.url()
      : null
  )
    website: string | null
}
