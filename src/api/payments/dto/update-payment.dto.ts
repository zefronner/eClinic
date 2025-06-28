import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/common/enums';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Payment Amount',
    example: 50,
    required: true
  })
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'Payment Method (cash or card)',
    example: 'cash',
    required: true
  })
  @IsEnum(PAYMENT_METHOD)
  method?: PAYMENT_METHOD;

  @ApiProperty({
    description: 'Payment status (pending, completed, failed, cancelled)',
    example: 'pending',
    required: true
  })
  @IsEnum(PAYMENT_STATUS)
  status?: PAYMENT_STATUS;
}