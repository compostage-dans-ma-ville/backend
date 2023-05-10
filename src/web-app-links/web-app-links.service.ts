import { Injectable } from '@nestjs/common'

@Injectable()
export class WebAppLinksService {
  activateAccount(token: string): string {
    return `${process.env.APP_BASEURL}/authentication/activate/${token}`
  }

  resetPassword(token: string): string {
    return `${process.env.APP_BASEURL}/authentication/reset-password/${token}`
  }
}
