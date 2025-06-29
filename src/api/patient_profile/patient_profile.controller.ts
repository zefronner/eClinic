import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientProfileService } from './patient_profile.service';
import { CreatePatientProfileDto } from './dto/create-patient_profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient_profile.dto';

@Controller('patient_profile')
export class PatientProfileController {
  constructor(private readonly patientProfileService: PatientProfileService) {}

  @Post()
  create(@Body() createPatientProfileDto: CreatePatientProfileDto) {
    return this.patientProfileService.create(createPatientProfileDto);
  }

  @Get()
  findAll() {
    return this.patientProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientProfileDto: UpdatePatientProfileDto) {
    return this.patientProfileService.update(+id, updatePatientProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientProfileService.remove(+id);
  }
}
