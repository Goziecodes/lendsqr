import dotenv from 'dotenv';
dotenv.config();
export default {

  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DATABASE,
      user: process.env.DBUSER,
      password: process.env.PASSWORD,
      port: Number(process.env.DB_PORT)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DATABASE,
      user: process.env.DBUSER,
      password: process.env.PASSWORD,
      port: Number(process.env.DB_PORT)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

};

