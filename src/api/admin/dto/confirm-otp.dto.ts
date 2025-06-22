import { IsNotEmpty, IsNumberString } from 'class-validator';
import { IsCustomEmail } from 'src/common/decorators/is-email';

export class ConfirmOTPDto {
  @IsNotEmpty()
  @IsCustomEmail()
  email:string;

  @IsNotEmpty()
  @IsNumberString()
  otp: number;
}
