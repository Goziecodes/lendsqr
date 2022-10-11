import databaseConfig from './knexfile'
import Knex, { Knex as KnexType} from 'knex';

// make null before connection is initialized
export let database: KnexType<any, unknown[]>;
const env = (process.env.NODE_ENV || 'development') as keyof typeof databaseConfig;

export const connectDatabase =  async () => {
  try {
     database = Knex(databaseConfig[env]);
     await database.raw('SELECT 1');
     console.log('mysql db connected successfully');
  } catch (error) {
    console.log(error);
    process.exit(0)
  }
}


