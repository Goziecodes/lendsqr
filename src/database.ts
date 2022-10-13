import databaseConfig from '../knexfile'
import Knex, { Knex as KnexType} from 'knex';
import { Model } from 'objection';

// database singleton
const env = (process.env.NODE_ENV || 'development') as keyof typeof databaseConfig;
const database: KnexType<any, unknown[]> = Knex(databaseConfig[env]); 

export const connectDatabase =  async () => {
  try {
     await database.raw('SELECT 1');
     Model.knex(database);
     console.log('mysql db connected successfully');
     return database;
  } catch (error) {
    console.log(error);
    process.exit(0)
  }
}

export const getConnection = () => database
