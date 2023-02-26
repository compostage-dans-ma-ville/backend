import { Address, Site } from '@prisma/client'
import { Factory } from 'nestjs-seeder'

export class SiteSchema implements Site {
  id: number

  createdAt: Date

  updatedAt: Date

  @Factory(faker => faker?.animal.rabbit())
    name: string

  @Factory(faker => faker?.lorem.paragraphs(5))
    description: string | null

  avatar: string | null

  @Factory(faker => ({
    houseNumber: faker?.address.buildingNumber(),
    streetName: faker?.address.street(),
    zipCode: Number(faker?.address.zipCode('#####')),
    city: faker?.address.cityName(),
    longitude: faker?.address.longitude(),
    latitude: faker?.address.latitude()
  }))
    address: Address

  addressId: number

  organizationId: number | null
}
