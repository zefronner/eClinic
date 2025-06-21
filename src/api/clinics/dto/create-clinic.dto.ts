import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone_number: string;

  @IsEmail()
  email: string;

  @IsString()
  region: string;

  @IsString()
  is_active: string;
}
