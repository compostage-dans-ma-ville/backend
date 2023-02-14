import { Module } from '@nestjs/common'
import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { UserModule } from './user.module'
import { PrismaModule } from '~/prisma/prisma.module'
import { SiteModule } from '~/entities/site/site.module'
import { AddressModule } from '~/entities/address/address.module'

@Module({
  imports: [UserModule, PrismaModule, SiteModule, AddressModule],
  controllers: [AppController],
  providers: [AppService, PrismaModule]
})
export class AppModule {}
