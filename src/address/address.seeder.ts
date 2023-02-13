import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { PrismaService } from '../prisma/prisma.service'
import { AddressSchema } from './address.schema'

@Injectable()
export class AddressSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const addresses = DataFactory.createForClass(AddressSchema)
      .generate(10) as Prisma.AddressCreateInput[]
    await this.prisma.address.createMany({ data: addresses })
  }

  async drop(): Promise<void> {
    await this.prisma.address.deleteMany()
  }
}
