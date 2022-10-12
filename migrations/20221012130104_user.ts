import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('lendsqr_users', function (table){
        table.increments('id');
        table.string('fullname');
        table.string('email');
        table.string('password');
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("lendsqr_users");
}

