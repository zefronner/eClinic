import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'Bemor ID' })
  patient_id: number;

  @ApiProperty({ example: 2, description: 'Shifokor ID' })
  doctor_id: number;

  @ApiProperty({ example: '2025-06-23T09:00:00Z', description: 'Uchrashuv vaqti' })
  appointment_time: Date;

  @ApiProperty({ example: 'pending', description: 'Uchrashuv statusi' })
  status: string;

  @ApiProperty({ example: 'General checkup', description: 'Uchrashuv sababi' })
  reason: string;

  @ApiProperty({ example: '2025-06-22T14:00:00Z', description: 'Yaratilgan vaqt' })
  createdAt: Date;
}
