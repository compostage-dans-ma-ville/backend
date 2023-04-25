import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { PrismaModule } from '~/prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from '~/user/user.module'
import { SiteModule } from '~/site/site.module'
import { AddressModule } from '~/address/address.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AddressModule,
    AuthModule,
    UserModule,
    PrismaModule,
    SiteModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule {}
