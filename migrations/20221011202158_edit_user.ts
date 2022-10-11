import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('lendsqr_users', function (table){
        table.dropColumn('balance')
        table.dropColumn('created_at')
        table.dropColumn('updated_at')
    })
    .alterTable('lendsqr_users', function (table){
        table.timestamps(true, true);
    })
}



export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('lendsqr_users', function (table){
        table.string('balance')
        table.timestamps(false, false);
    })
}

