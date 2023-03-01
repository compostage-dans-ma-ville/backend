import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { PrismaService } from '../prisma/prisma.service'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const users = DataFactory.createForClass(UserDto)
      .generate(20) as Prisma.UserCreateManyInput[]
    await this.prisma.user.createMany({ data: users })
  }

  async drop(): Promise<void> {
    await this.prisma.user.deleteMany()
  }
}
