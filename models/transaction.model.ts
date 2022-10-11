
import { Model } from 'objection';

import { getConnection } from '../database';
Model.knex(getConnection())

export interface Transaction {
    readonly id: number;
    readonly amount: number;
    readonly sender: string;
    readonly reciever: string;
    readonly trans_type: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export class TransactionModel extends Model implements Transaction {
  id!: number;
  amount!: number;
  sender!: string;
  reciever!: string;
  trans_type!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return 'lendsqr_transactions';
  }

  static async fundWallet(amount: Partial<Transaction>) {
    console.log(amount, 'amount')
  }

}
