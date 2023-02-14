import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { PrismaService } from '~/prisma/prisma.service'
import { UserSchema } from './user.schema'

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const users = DataFactory.createForClass(UserSchema)
      .generate(10) as Prisma.UserCreateManyInput[]
    await this.prisma.user.createMany({ data: users })
  }

  async drop(): Promise<void> {
    await this.prisma.user.deleteMany()
  }
}
