import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { MedicalRecord } from 'src/api/medical_records/entities/medical_record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, MedicalRecord])],
  providers: [PrescriptionsService],
  controllers: [PrescriptionsController],
})
export class PrescriptionsModule {}
