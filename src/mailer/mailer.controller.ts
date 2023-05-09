import {
  Controller, Get, HttpStatus, Res
} from '@nestjs/common'
import { Response } from 'express'
import { MailerService } from './mailer.service'
import { ApiExcludeController } from '@nestjs/swagger'

@ApiExcludeController()
@Controller('mail-templates-preview')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
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
          title: 'Valider votre compte',
          validationLink: 'test',
          username: 'John'
        }
      ).html)
  }
}
