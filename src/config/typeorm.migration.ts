import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: `.${process.env.NODE_ENV}.env`, debug: true });
import { typeOrmConfig } from './typeorm.config';

const datasource = new DataSource(typeOrmConfig);
export default datasource;
