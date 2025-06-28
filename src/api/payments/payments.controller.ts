import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '../../core/entity/payments-entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new Payment' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment successfully created',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {
          id: 1,
          amount: 50,
          method: 'cash',
          status: 'pending',
          createdAt: '2025-06-28T14:30:00.000Z',
          updatedAt: '2025-06-28T14:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  create(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Payments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all payments',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: 1,
            amount: 50,
            method: 'cash',
            status: 'pending',
            createdAt: '2025-06-28T14:30:00.000Z',
            updatedAt: '2025-06-28T14:30:00.000Z',
          },
        ],
      },
    },
  })
  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Payment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Payment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment ID' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment successfully updated',
    schema: {
      example: {
        id: 1,
        amount: 100,
        method: 'card',
        status: 'completed',
        createdAt: '2025-06-28T14:30:00.000Z',
        updatedAt: '2025-06-28T15:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Payment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment successfully deleted',
    schema: {
      example: {
        status_code: 200,
        message: 'Payment deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.paymentsService.remove(id);
    return { message: 'Payment deleted successfully' };
  }
}
