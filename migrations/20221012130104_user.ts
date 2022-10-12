import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('lendsqr_users', function (table){
        table.increments('id');
        table.string('fullname');
        table.string('email');
        table.string('password');
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("lendsqr_users");
}

