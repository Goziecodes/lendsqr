import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable("lendsqr_transactions", function (table){
        table.enum('trans_category', ["DEPOSIT", "WITHDRAWAL", "TRANSFER"])
    })
}


export async function down(knex: Knex): Promise<void> {
      return knex.schema
      .alterTable('lendsqr_transactions', function (table){
        table.dropColumn('trans_category')
    })
}

