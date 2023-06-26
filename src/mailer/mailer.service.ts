import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import Handlebars from 'handlebars'
import mjml2html from 'mjml'
import { Transporter, createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { WebAppLinksService } from '~/web-app-links/web-app-links.service'
import { Site, User } from '@prisma/client'

const PATH_TO_TEMPLATES = path.resolve(__dirname, './templates')
const PATH_TO_PARTIALS = path.resolve(PATH_TO_TEMPLATES, './partials')

interface AskSiteInvitationParams {
  description: string
  site: Site
  pathToSite: string
  user: User
}
interface GlobalParams {
  title: string
}
interface ChangePasswordParams {
  redirectLink: string
}
interface ValidateEmailParams {
  validationLink: string
  username: string
}
interface TemplateParams {
  resetPassword: ChangePasswordParams & GlobalParams
  validateEmail: ValidateEmailParams & GlobalParams
  askSiteInvitation: AskSiteInvitationParams & GlobalParams
}
type Template<T = TemplateParams> = {
  [key in keyof T ]: Handlebars.TemplateDelegate<T[key]>
}

@Injectable()
export class MailerService {
  private templates: Template = {} as Template

  private transporter: Transporter

  constructor(private readonly webAppLinksService: WebAppLinksService) {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
      }
    })
    this.loadTemplates()
  }

  sendEmail = <T extends keyof Template>(
    to: string | string[],
    subject: string,
    template: T,
    params: TemplateParams[T]
  ): Promise<SMTPTransport.SentMessageInfo> => {
    const { html, errors } = this.renderEmail(
      template,
      params
    )
    const useBcc = Array.isArray(to)

    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors))
    }

    return this.transporter.sendMail({
      from: 'les 3 bacs',
      to: useBcc ? undefined : to,
      bcc: useBcc ? to : undefined,
      subject,
      html
    })
  }

  public renderEmail<T extends keyof Template>(
    template: T,
    params: TemplateParams[T]
  ): ReturnType<typeof mjml2html> {
    return mjml2html(this.templates[template]({
      ...params,
      logo: this.webAppLinksService.image('small-icon-with-text.png'),
      pathToApp: this.webAppLinksService.home()
    }))
  }

  private loadTemplates(): void {
    this.loadPartials()
    const templates = this.getTemplatesInFolder(PATH_TO_TEMPLATES)

    const compiledTemplates: Template = {
      resetPassword: Handlebars.compile(templates['reset-password']),
      validateEmail: Handlebars.compile(templates['validate-email']),
      askSiteInvitation: Handlebars.compile(templates['ask-site-invitation'])
    }

    this.templates = compiledTemplates
  }

  private loadPartials(): void {
    const partials = this.getTemplatesInFolder(PATH_TO_PARTIALS)

    Object.entries(partials).forEach(([name, template]) => {
      Handlebars.registerPartial(name, template)
    })
  }

  private getTemplatesInFolder(dir: string): Record<string, string> {
    return fs.readdirSync(dir)
      .reduce<Record<string, string>>((acc, name) => {
        const pathToName = path.resolve(dir, name)
        const isFile = !fs.lstatSync(pathToName).isDirectory()

        if (isFile) {
          acc[path.parse(name).name] = fs.readFileSync(pathToName, 'utf8')
        }

        return acc
      }, {})
  }
}
