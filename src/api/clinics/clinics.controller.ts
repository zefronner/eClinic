import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Clinic } from '../../core/entity/clinics-entity'

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicService: ClinicsService) {}

  @Post()
  async create(@Body() dto: CreateClinicDto): Promise<Clinic> {
    return this.clinicService.create(dto);
  }

  @Get()
  async findAll(): Promise<Clinic[]> {
    return this.clinicService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClinicDto): Promise<Clinic> {
    return this.clinicService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.clinicService.remove(id);
    return { message: 'Clinic deleted successfully' };
  }
}
