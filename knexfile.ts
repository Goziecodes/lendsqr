import dotenv from 'dotenv';
dotenv.config();
console.log({
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  user: process.env.DBUSER,
  password: process.env.PASSWORD
})
export default {

  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DATABASE,
      user: process.env.DBUSER,
      password: process.env.PASSWORD
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
      user: process.env.USER,
      password: process.env.PASSWORD
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

