
import { Model } from 'objection';


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

  static get tableName() {
    return 'lendsqr_transactions';
  }

  static async fundWallet(amount: number, user: Required<User>) {
    return this.query().insert({
    amount,
    trans_type: "CREDIT",
    trans_category: "DEPOSIT",
  });
  }

}
