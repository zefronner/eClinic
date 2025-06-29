import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsModule } from './api/clinics/clinics.module';
import { PaymentsModule } from './api/payments/payments.module';


@Module({
  imports: [
TypeOrmModule.forRoot({
  type: 'postgres',
  url: config.DB_URL,
  synchronize: true,
  autoLoadEntities: true,
  entities: ['dist/core/entity*.entity{.ts,.js}']
}),
ClinicsModule,
PaymentsModule,
]
})
export class AppModule {}
