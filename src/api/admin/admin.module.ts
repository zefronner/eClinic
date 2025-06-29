import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entities/admin.entity';
import { FileModule } from '../file/file.module';
import { MailModule } from 'src/infrastructure/lib/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), 
  FileModule, 
  MailModule,
  CacheModule.register({
    isGlobal: true
  }),
  JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AdminModule {}
