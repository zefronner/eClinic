import { IsNotEmpty, IsString } from 'class-validator';

export class SigninAdminDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
