import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
const dbConfig = config.get('db');

console.log(process.env.TASKS_DB_PW);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.TASKS_DB_HOSTNAME || dbConfig.host,
  port: process.env.TASKS_DB_PORT || dbConfig.port,
  username: process.env.TASKS_DB_USERNAME || dbConfig.username,
  password: process.env.TASKS_DB_PW || dbConfig.password,
  database: process.env.TASKS_DB_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TASKS_TYPEORM_SYNC || dbConfig.synchronize,
};
