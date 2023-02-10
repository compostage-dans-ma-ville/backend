import { Factory } from 'nestjs-seeder'

export class UserSchema {
  @Factory(faker => faker?.name.firstName())
    firstname: string

  @Factory(faker => faker?.name.lastName())
    latname: string

  @Factory(faker => faker?.internet.email())
    email: string
}
