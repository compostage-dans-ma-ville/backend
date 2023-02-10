import { Injectable } from '@nestjs/common'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserSchema } from './user.schema'

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    // Generate 10 users.
    const users = DataFactory.createForClass(UserSchema).generate(10)
    console.log(users)
    // Insert into the database.
    // this.prisma.user.createMany({ data: users })
  }

  async drop(): Promise<void> {
    this.prisma.user.deleteMany()
  }
}
