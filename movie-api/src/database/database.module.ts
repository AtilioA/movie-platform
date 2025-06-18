import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';

const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (_configService: ConfigService): TypeOrmModuleOptions => ({
    ...databaseConfig,
    autoLoadEntities: true,
  }),
};

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
