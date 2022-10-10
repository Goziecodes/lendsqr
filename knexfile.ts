import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {

  development: {
    client: "mysql2",
    connection: {
      database: "wallet",
      user: "root",
      password: "rootuser1"
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
      database: "wallet",
      user: "root",
      password: "rootuser1"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
