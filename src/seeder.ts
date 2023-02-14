import { seeder } from 'nestjs-seeder'
import { PrismaModule } from './prisma/prisma.module'
import { AddressSeeder } from './entities/address/address.seeder'
import { UserSeeder } from './entities/user/user.seeder'
import { SiteSeeder } from './entities/site/site.seeder'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

seeder({
  imports: [
    PrismaModule
  ]
}).run([AddressSeeder, UserSeeder, SiteSeeder])
