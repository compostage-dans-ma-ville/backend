import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { CaslModule } from '~/casl/casl.module'

@Module({
  imports: [PrismaModule, CaslModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService]
})
export class UserModule { }
