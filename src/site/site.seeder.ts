import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { PrismaService } from '../prisma/prisma.service'
import { SiteSchema } from './site.schema'

@Injectable()
export class SiteSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const sites = DataFactory.createForClass(SiteSchema)
      .generate(10) as Prisma.SiteCreateManyInput[]
    this.prisma.site.createMany({ data: sites })
  }

  async drop(): Promise<void> {
    this.prisma.site.deleteMany()
  }
}
