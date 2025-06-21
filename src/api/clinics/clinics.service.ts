import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from 'src/core/entity/clinics-entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
  ) {}

  async create(dto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.clinicRepo.create(dto);
    return this.clinicRepo.save(clinic);
  }

  async findAll(): Promise<Clinic[]> {
    return this.clinicRepo.find({ where: {} });
  }

  async findOne(id: number): Promise<Clinic> {
    const clinic = await this.clinicRepo.findOne({ where: { id} });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  async update(id: number, dto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);
    Object.assign(clinic, dto);
    return this.clinicRepo.save(clinic);
  }

  async remove(id: number): Promise<void> {
    const clinic = await this.findOne(id);
    await this.clinicRepo.softRemove(clinic);
  }
}
