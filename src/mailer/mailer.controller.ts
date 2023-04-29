import {
  Controller, Get, HttpStatus, Res
} from '@nestjs/common'
import { Response } from 'express'
import { MailerService } from './mailer.service'

@Controller('mail-templates-preview')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  @Get('change-password')
  root(@Res() res: Response) {
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
}
