import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { PatientProfileModule } from './patient_profile/patient_profile.module';
import { config } from 'src/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
TypeOrmModule.forRoot({
  type: 'postgres',
  url: config.DB_URL,
  synchronize: true,
  autoLoadEntities: true,
  entities: ['dist/core/entity*.entity{.ts,.js}']
}),
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', '..', '..',   'base'),
  serveRoot: '/api/v1/base'
}),
CacheModule.register({ isGlobal: true }),
JwtModule.register({ global: true }),
  AdminModule,
  PatientProfileModule
]
})
export class AppModule {}
