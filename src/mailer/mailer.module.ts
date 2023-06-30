import { Global, Module, ModuleMetadata } from '@nestjs/common'
import { MailerService } from './mailer.service'
import { MailerController } from './mailer.controller'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'

const controllers: ModuleMetadata['controllers'] = []
if (process.env.NODE_ENV === 'development') controllers.push(MailerController)

@Global()
@Module({
  providers: [MailerService, WebAppLinksService],
  exports: [MailerService, WebAppLinksService],
  controllers
})
export class MailerModule {}
