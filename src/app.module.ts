import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './api/roles/roles.module';
import { ClinicsModule } from './api/clinics/clinics.module';
import { PaymentsModule } from './api/payments/payments.module';


@Module({
  imports: [
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
RolesModule,
ClinicsModule,
PaymentsModule
]
})
export class AppModule {}
