import { PickType } from '@nestjs/swagger'
import { UserDto } from '~/user/dto/User.dto'

export class SendResetPasswordEmailDto extends PickType(UserDto, ['email'] as const) {}
