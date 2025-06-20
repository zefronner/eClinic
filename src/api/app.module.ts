import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entities/admin.entity';
import { AdminModule } from './admin/admin.module';
import { PatientProfileModule } from './patient_profile/patient_profile.module';
import { PatientProfileEntity } from 'src/core/entities/patient_profile.entity';
import config from 'src/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }),
TypeOrmModule.forRoot({
  type: 'postgres',
  host: config.PG_HOST,
  port: config.PG_PORT,
  username: config.PG_USER,
  password: config.PG_PASS,
  database: config.PG_DB,
  synchronize: true,
  autoLoadEntities: true,
  entities: [AdminEntity, PatientProfileEntity]
}),
  AdminModule,
  PatientProfileModule
]
})
export class AppModule {}
