import { Address, Site } from '@prisma/client'
import { Factory } from 'nestjs-seeder'

export class SiteSchema implements Site {
  id: number

  createdAt: Date

  updatedAt: Date

  @Factory(faker => faker?.animal.rabbit())
    name: string

  @Factory(faker => Math.random() > 0.5 ? faker?.lorem.paragraphs(5) : null)
    description: string | null

  avatar: string | null

  @Factory(faker => ({
    houseNumber: faker?.address.buildingNumber(),
    streetName: faker?.address.street(),
    zipCode: faker?.address.zipCode(),
    city: faker?.address.cityName(),
    longitude: faker?.address.longitude(),
    latitude: faker?.address.latitude()
  }))
    address: Address

  organizationId: number | null
}
