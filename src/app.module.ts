import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionsModule } from './api/prescriptions/prescriptions.module';
import { MedicalRecordsModule } from './api/medical_records/medical_records.module';
import { AppointmentsModule } from './api/appointments/appointments.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }),
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
  synchronize: true,
  autoLoadEntities: true,
  entities: []
}),
PrescriptionsModule,
MedicalRecordsModule,
AppointmentsModule,
]
})
export class AppModule {}
