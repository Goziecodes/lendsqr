import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('lendsqr_transactions', function (table){
        table.dropColumn('created_at')
        table.dropColumn('updated_at')
    })
    .alterTable('lendsqr_transactions', function (table){
        table.timestamps(true, true);
    })
}



export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('lendsqr_transactions', function (table){
        table.timestamps(false, false);
    })
}

