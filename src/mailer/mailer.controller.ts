import {
  Controller, Get, HttpStatus, Res
} from '@nestjs/common'
import { Response } from 'express'
import { MailerService } from './mailer.service'
import { ApiExcludeController } from '@nestjs/swagger'
import { Site, User } from '@prisma/client'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'

@ApiExcludeController()
@Controller('mail-templates-preview')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly webAppLinksService: WebAppLinksService,
  ) {}

  @Get('change-password')
  changePassword(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(this.mailerService.renderEmail(
        'resetPassword',
        {
          title: 'Réinitialiser votre mot de passe',
          redirectLink: 'test'
        }
      ).html)
  }

  @Get('validate-email')
  validateEmail(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(this.mailerService.renderEmail(
        'validateEmail',
        {
          title: 'Demande d\'invitation pour collaborer sur le site',
          validationLink: 'test',
          username: 'John'
        }
      ).html)
  }

  @Get('ask-site-invitation')
  askSiteInvitation(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(this.mailerService.renderEmail(
        'askSiteInvitation',
        {
          title: 'Demande d\'invitation',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Id diam vel quam elementum pulvinar etiam non quam lacus. Aliquet eget sit amet tellus. Fermentum posuere urna nec tincidunt. Elementum nisi quis eleifend quam adipiscing.',
          site: {
            id: 42,
            name: 'Site de compostage de Metz'
          } as Site,
          user: {
            firstname: 'firstname',
            lastname: 'lastname',
            email: 'email'
          } as User,
          pathToSite: this.webAppLinksService.site(42)
        }
      ).html)
  }

  @Get('invite-site-member')
  inviteSiteMember(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(this.mailerService.renderEmail(
        'inviteSiteMember',
        {
          title: 'Invitation',
          site: {
            id: 42,
            name: 'Site de compostage de Metz'
          } as Site,
          email: 'justauser@gmail.com',
          isAlreadyUser: false,
          pathToSite: this.webAppLinksService.site(42),
          redirectLink: 'test',
          registerLink: this.webAppLinksService.register()
        }
      ).html)
  }
}
