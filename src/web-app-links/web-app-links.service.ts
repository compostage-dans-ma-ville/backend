import { Injectable } from '@nestjs/common'

@Injectable()
export class WebAppLinksService {
  public activateAccount(token: string): string {
    return `${process.env.APP_BASEURL}/authentification/activate/${token}`
  }
}
