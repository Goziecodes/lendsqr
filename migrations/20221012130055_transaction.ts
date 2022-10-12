import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('lendsqr_transactions', function (table){
        table.increments('id');
        table.integer('sender');
        table.integer('reciever');
        table.enum('trans_type', ['DEBIT', 'CREDIT']);
        table.float('amount');
        table.enum('trans_category', ["DEPOSIT", "WITHDRAWAL", "TRANSFER"]);
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("lendsqr_transactions")
}

