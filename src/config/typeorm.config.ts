import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import * as path from 'node:path';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: true,
  entities: [path.resolve(__dirname, '../**/*.entity.{js,ts}')],
  migrations: [path.resolve(__dirname, '../migrations/*.{js,ts}')],
  migrationsTableName: "custom_migration_table",
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => typeOrmConfig,
};
