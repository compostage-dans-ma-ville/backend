import { seeder } from 'nestjs-seeder'
import { PrismaModule } from './prisma/prisma.module'
import { UserSeeder } from './user/user.seeder'

seeder({
  imports: [
    PrismaModule
  ]
}).run([UserSeeder])
