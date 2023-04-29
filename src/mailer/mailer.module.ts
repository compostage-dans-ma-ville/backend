import { Global, Module, ModuleMetadata } from '@nestjs/common'
import { MailerService } from './mailer.service'
import { MailerController } from './mailer.controller'

const controllers: ModuleMetadata['controllers'] = []
if (process.env.NODE_ENV === 'development') controllers.push(MailerController)

@Global()
@Module({
  providers: [MailerService],
  exports: [MailerService],
  controllers
})
export class MailerModule {}
