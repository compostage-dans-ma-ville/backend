import { Address } from '@prisma/client'
import { Factory } from 'nestjs-seeder'

export class AddressSchema implements Address {
  id: number

  @Factory(faker => faker?.address.buildingNumber().toString())
    houseNumber: string

  @Factory(faker => faker?.address.street())
    streetName: string

  @Factory(() => Math.floor(Math.random() * 90000) + 10000)
    zipCode: number

  @Factory(faker => faker?.address.city())
    city: string

  @Factory(faker => faker?.address.longitude())
    longitude: string

  @Factory(faker => faker?.address.latitude())
    latitude: string
}
