import { Module } from '@nestjs/common'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'
import { UserModule } from '~/user/user.module'
import { AuthModule } from '~/auth/auth.module'

@Module({
  imports: [DailyScheduleModule, UserModule, AuthModule],
  controllers: [SiteController],
  providers: [SiteService, PrismaService]
})
export class SiteModule {}
