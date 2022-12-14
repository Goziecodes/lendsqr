import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('lendsqr_users', function (table){
        table.increments('id');
        table.string('fullname');
        table.string('email');
        table.string('password');
        table.timestamps(true);
        // table.timestamp('created_at').defaultTo(knex.fn.now());
        // table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("lendsqr_users");
}

