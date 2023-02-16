import { CutVote } from '../entities/CutVote';
import { DataSource } from 'typeorm';
import User from '../entities/User';
import { CutReview } from '../entities/CutReview';

export const createDB = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'ghibli_graphql',
  username: 'root',
  password: 'qwer1234',
  logging: !(process.env.NODE_ENV === 'production'),
  synchronize: true, //entities에 명시된 데이터 모델들을 DB에 자동으로 동기화
  entities: [User, CutVote, CutReview],
});

export function createConnection(): Promise<DataSource> {
  return createDB.initialize();
}



