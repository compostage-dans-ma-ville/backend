import { seeder } from 'nestjs-seeder'
import { AddressSeeder } from '~/address/address.seeder'
import { PrismaModule } from '~/prisma/prisma.module'
import { SiteSeeder } from '~/seeder/site.seeder'
import { UserSeeder } from '~/user/user.seeder'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

seeder({
  imports: [
    PrismaModule
  ]
}).run([AddressSeeder, UserSeeder, SiteSeeder])
