import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, isBoolean, IsBoolean } from 'class-validator';

export class CreateClinicDto {
  @ApiProperty({
    description: 'Clinic Name',
    example: 'Joe Clinic',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Clinic Adress',
    example: 'Toshkent, Bekabad 22',
    required: true
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Clinic Phone Number',
    example: '+9980001234',
    required: true
  })
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'Clinic Email',
    example: 'example@gmail.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Clinic Region',
    example: 'Uzbekistan',
    required: true
  })
  @IsString()
  region: string;

  @ApiProperty({
    description: 'Clinic isActive?',
    example: true,
    required: true
  })
  @IsBoolean()
  is_active: boolean;
}
