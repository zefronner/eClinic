import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Clinic } from '../../core/entity/clinics-entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicService: ClinicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinic' })
  @ApiBody({ type: CreateClinicDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Clinic successfully created',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {
          id: 1,
          name: 'Joe Clinic',
          address: 'Toshkent, Bekabad 22',
          phone_number: '+998900001234',
          email: 'example@gmail.com',
          region: 'Uzbekistan',
          is_active: true,
          created_at: '2025-06-25T14:20:01.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  async create(@Body() dto: CreateClinicDto): Promise<Clinic> {
    return this.clinicService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of clinics',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: 1,
            name: 'Joe Clinic',
            address: 'Yunusobod 12, Tashkent',
            phone_number: '+998901234567',
            email: 'clinic@example.com',
            region: 'Tashkent',
            is_active: true,
            created_at: '2025-06-25T14:20:01.000Z',
          },
        ],
      },
    },
  })
  async findAll(): Promise<Clinic[]> {
    return this.clinicService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clinic by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateClinicDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicDto,
  ): Promise<Clinic> {
    return this.clinicService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete clinic by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic successfully deleted',
    schema: {
      example: {
        status_code: 200,
        message: 'Clinic deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.clinicService.remove(id);
    return { message: 'Clinic deleted successfully' };
  }
}
