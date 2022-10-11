import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('lendsqr_transactions', function (table){
        table.increments('id');
        table.integer('sender');
        table.integer('reciever');
        table.enum('trans_type', ['DEBIT', 'CREDIT']);
        table.float('amount');
        table.timestamp('created_at');
        table.timestamp('updated_at');
    })
    .createTable('lendsqr_users', function (table){
        table.increments('id');
        table.string('fullname');
        table.string('email');
        table.string('password');
        table.float('balance');
        table.timestamp('created_at');
        table.timestamp('updated_at');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("lendsqr_transactions")
      .dropTable("lendsqr_users");
}

