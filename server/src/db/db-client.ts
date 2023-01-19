import User from "..//entities/User";
import { Connection, createConnection } from "typeorm";

export const createDB = async (): Promise<Connection> => 
createConnection({
type: 'mysql',
host: 'localhost',
port: 3306,
database: 'ghibli_graphql',
username: 'root',
password: 'qwer1234',
logging: !(process.env.NODE_ENV === 'production'),
synchronize: true,
entities: [User]
})