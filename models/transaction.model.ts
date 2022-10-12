
import { Knex } from 'knex';
import { Model, raw, Transaction as DBTransaction } from 'objection';


import { getConnection } from '../database';
import { User } from './user.model';
Model.knex(getConnection())

export interface Transaction {
    readonly id: number;
    readonly amount: number;
    readonly sender: string;
    readonly reciever: string;
    readonly trans_type: string;
    readonly trans_category: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export class TransactionModel extends Model implements Transaction {
  id!: number;
  amount!: number;
  sender!: string;
  reciever!: string;
  trans_type!: string;
  trans_category!: string;
  created_at!: string;
  updated_at!: string;
  balance!: number;

  static get tableName() {
    return 'lendsqr_transactions';
  }

  static async fundWallet(amount: number, user: User) {
    return this.query().insert({
    amount,
    trans_type: "CREDIT",
    trans_category: "DEPOSIT",
    reciever: user.id,
  });
  }

  static async balance(user: User, trx?: DBTransaction | undefined) {

    const balance = await this.query(trx)
    .select(raw("SUM(CASE WHEN trans_type = 'CREDIT' THEN amount ELSE -1 * amount END) as balance"))
    .where({reciever: user.id, trans_type: 'CREDIT'})
    .orWhere({sender: user.id, trans_type: 'DEBIT'})
    .first()

    return balance || {balance: 0}
  }


  static async withdraw(amount: number, user: User) {
    try {
      
      const withdrawTransaction = await this.transaction(async trx => {

        const userBalance = await this.balance(user, trx)

        if (userBalance.balance < amount) {
          return Promise.reject('Insufficient funds!'); 
        }

        return this.query().insert({
          amount,
          trans_type: "DEBIT",
          trans_category: "WITHDRAWAL",
          sender: user.id
        });
      })

      return withdrawTransaction

    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async transfer(transferDetails: Pick<Transaction, "amount" | "reciever">, user: Required<User>) {
    try {
      
      const transferTransaction = await this.transaction(async trx => {
        const userBalance = await this.balance(user, trx)        

        if (userBalance.balance < transferDetails.amount) {
          return Promise.reject('Insufficient funds!'); 
        }

        await this.query(trx).insert({
          amount: transferDetails.amount,
          trans_type: "DEBIT",
          trans_category: "TRANSFER",
          reciever: transferDetails.reciever,
          sender: user.id,
        });
      
        return this.query(trx).insert({
          amount: transferDetails.amount,
          trans_type: "CREDIT",
          trans_category: "TRANSFER",
          reciever: transferDetails.reciever,
          sender: user.id,
        });

      })

      return "transfer successful"

    } catch (error) {
      return Promise.reject(error);
    }
  }

}
