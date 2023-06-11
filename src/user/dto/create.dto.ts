import { PickType } from '@nestjs/swagger'
import { UserDto } from './User.dto'

export class CreateUserDto extends PickType(UserDto, ['email', 'firstname', 'lastname', 'password'] as const) {}
