import { DataSource } from 'typeorm';
import User from '../entities/User';

export const createDB = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'ghibli_graphql',
  username: 'root',
  password: 'qwer1234',
  logging: !(process.env.NODE_ENV === 'production'),
  synchronize: true,
  entities: [User],
});

export function createConnection(): Promise<DataSource> {
  return createDB.initialize();
}



