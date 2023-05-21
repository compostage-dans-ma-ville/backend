import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString, IsNumber } from 'class-validator'

export class AddressDto {
    @Expose()
    @IsNumber()
    @ApiProperty({
      description: 'the identifier of an address',
      example: '6 ter'
    })
      id: number

    @Expose()
    @IsString()
    @ApiProperty({
      description: 'Number associated with the street',
      example: '6 ter'
    })
      houseNumber: string

    @Expose()
    @IsString()
    @ApiProperty({
      description: 'The name of the street',
      example: 'rue Lothaire'
    })
      streetName: string

    @Expose()
    @IsNumber()
    @ApiProperty({
      description: 'Postcode of the address',
      example: 67150
    })
      zipCode: number

    @Expose()
    @IsString()
    @ApiProperty({
      description: 'The city or village name of the address.',
      example: 'Erstein'
    })
      city: string

    @Expose()
    @IsNumber()
    @ApiProperty({
      description: 'the exact longitude in decimal degree',
      example: 7.66600
    })
      longitude: number

    @Expose()
    @IsNumber()
    @ApiProperty({
      description: 'the exact latitude in decimal degree',
      example: 48.42523
    })
      latitude: number
}
