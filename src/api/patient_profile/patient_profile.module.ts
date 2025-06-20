import { Module } from '@nestjs/common';
import { PatientProfileService } from './patient_profile.service';
import { PatientProfileController } from './patient_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfileEntity } from 'src/core/entities/patient_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfileEntity])],
  controllers: [PatientProfileController],
  providers: [PatientProfileService],
})
export class PatientProfileModule {}
