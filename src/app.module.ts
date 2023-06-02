import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { PrismaModule } from '~/prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from '~/user/user.module'
import { SiteModule } from '~/site/site.module'
import { AddressModule } from '~/address/address.module'
import { APP_GUARD } from '@nestjs/core'
import { AbilityGuard } from './ability/ability.guard'
import { AbilityModule } from './ability/ability.module'
import { MailerModule } from './mailer/mailer.module'
import { WebAppLinksService } from './web-app-links/web-app-links.service'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MulterModule.register(
      { dest: './uploaded-pictures' },
    ),
    AddressModule,
    AuthModule,
    UserModule,
    PrismaModule,
    SiteModule,
    AbilityModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AbilityGuard
    },
    WebAppLinksService
  ]
})
export class AppModule { }
