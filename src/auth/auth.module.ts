import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '~/prisma/prisma.module'
import { UserModule } from '~/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY ?? 'test',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '4w'
      }
    })
  ],
  providers: [AuthService, JwtStrategy, WebAppLinksService],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, JwtStrategy]
})
export class AuthModule {}
