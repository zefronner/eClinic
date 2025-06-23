import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 1, description: 'Bemor ID' })
  patient_id: number;

  @ApiProperty({ example: 'Some diagnosis', description: 'Tashxis' })
  diagnosis: string;

  @ApiProperty({ example: '2025-06-22', description: 'Yaratilgan sana' })
  createdAt: Date;
}
