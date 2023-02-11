import { seeder } from 'nestjs-seeder'
import { PrismaModule } from './prisma/prisma.module'
import { AddressSeeder } from './address/address.seeder'
import { UserSeeder } from './user/user.seeder'

seeder({
  imports: [
    PrismaModule
  ]
}).run([AddressSeeder, UserSeeder])
