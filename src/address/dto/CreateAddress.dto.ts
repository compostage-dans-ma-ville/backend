import { OmitType } from '@nestjs/mapped-types'
import { AddressDto } from './Address.dto'

export class CreateAddressDto extends OmitType(AddressDto, ['id']) {}
