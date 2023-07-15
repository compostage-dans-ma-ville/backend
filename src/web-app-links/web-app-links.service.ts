import { Injectable } from '@nestjs/common'

@Injectable()
export class WebAppLinksService {
  home(): string {
    return process.env.APP_BASEURL!
  }

  register(): string {
    return `${process.env.APP_BASEURL}/authentication/register`
  }

  activateAccount(token: string): string {
    return `${process.env.APP_BASEURL}/authentication/activate/${token}`
  }

  resetPassword(token: string): string {
    return `${process.env.APP_BASEURL}/authentication/reset-password/${token}`
  }

  image(fileName: string): string {
    return `${process.env.APP_BASEURL}/images/${fileName}`
  }

  site(id: number): string {
    return `${process.env.APP_BASEURL}/sites/${id}`
  }

  siteWithInvitation(id: number, token: string): string {
    return `${process.env.APP_BASEURL}/sites/${id}?invitation=${token}`
  }
}
