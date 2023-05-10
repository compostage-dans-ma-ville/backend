import { PickType } from '@nestjs/swagger'
import { UserDto } from '~/user/dto/user.dto'

export class SendResetPasswordEmailDto extends PickType(UserDto, ['email'] as const) {}
