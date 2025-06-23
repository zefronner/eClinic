import { ApiProperty } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 1, description: 'Medical record ID' })
  medical_record_id: number;

  @ApiProperty({ example: 'Amoxicillin', description: 'Dori nomi' })
  medication: string;

  @ApiProperty({ example: '500mg', description: 'Dozalash' })
  dosage: string;

  @ApiProperty({ example: 'Twice a day', description: 'Korsatma' })
  instructions: string;

  @ApiProperty({ example: '2025-06-22', description: 'Yaratilgan sana' })
  createdAt: Date;
}
