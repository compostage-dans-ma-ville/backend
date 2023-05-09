import { PickType } from '@nestjs/swagger'
import { UserDto } from '~/user/dto/user.dto'

export class SendValidationEmailDto extends PickType(UserDto, ['email'] as const) {}
