import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePatientProfileDto } from './dto/create-patient_profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient_profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientProfileEntity } from 'src/core/entities/patient_profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientProfileService {
  constructor(
    @InjectRepository(PatientProfileEntity) private readonly patientRep: Repository<PatientProfileEntity>
  ) {}

  async create(createPatientProfileDto: CreatePatientProfileDto) {
    try {
      const patient = await this.patientRep.create(createPatientProfileDto)
      await this.patientRep.save(patient);
      return patient;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    };
  };

  async findAll() {
    try {
      const patients = await this.patientRep.find()
      return patients;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const patient = await this.patientRep.findOneBy({id});
      if(!patient) {
        throw new NotFoundException('Patient not found');
      };
      return patient;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, updatePatientProfileDto: UpdatePatientProfileDto) {
    try {
      await this.patientRep.update({ id }, updatePatientProfileDto);
      const patient = this.patientRep.findOneBy({ id });
      if(!patient) {
        throw new NotFoundException('Patient not found');
      };
      return patient;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const patient = await this.patientRep.delete(id);
      if(!patient) {
        throw new NotFoundException('Patient not found')
      };
      return {
        message: "success"
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    };
  };
};
