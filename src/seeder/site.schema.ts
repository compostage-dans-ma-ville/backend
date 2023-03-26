import { Address, Site } from '@prisma/client'
import { Factory } from 'nestjs-seeder'
import { DailyScheduleSchema } from '~/seeder/DailySchedule.schema'

export class SiteSchema implements Site {
  id: number

  createdAt: Date

  updatedAt: Date

  launchDate: Date

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
    longitude: Number(faker?.address.longitude()),
    latitude: Number(faker?.address.latitude())
  }))
    address: Address

  Schedules: DailyScheduleSchema[]

  addressId: number

  organizationId: number | null
}
