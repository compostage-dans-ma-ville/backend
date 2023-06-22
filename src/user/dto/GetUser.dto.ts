import { OmitType } from '@nestjs/swagger'
import { UserDto } from './User.dto'

export class GetUserDto extends OmitType(UserDto, ['role', 'email', 'createdAt', 'updatedAt']) {}
