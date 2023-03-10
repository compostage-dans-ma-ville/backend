import { Injectable } from '@nestjs/common'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { PrismaService } from '~/prisma/prisma.service'
import { SiteSchema } from './site.schema'

@Injectable()
export class SiteSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const sites = DataFactory.createForClass(SiteSchema)
      .generate(20)
    const siteCreations = await Promise.all(sites.map(async (s) => {
      const { address, ...site } = s as unknown as SiteSchema
      const { id } = await this.prisma.address.create({ data: address })
      return {
        ...site,
        addressId: id
      }
    }))
    await this.prisma.site.createMany({ data: siteCreations })
  }

  async drop(): Promise<void> {
    await this.prisma.site.deleteMany()
  }
}
