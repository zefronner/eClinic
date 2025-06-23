import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical_record.entity';
import { MedicalRecordsService } from './medical_records.service';
import { MedicalRecordsController } from './medical_records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
  providers: [MedicalRecordsService],
  controllers: [MedicalRecordsController],
})
export class MedicalRecordsModule {}
