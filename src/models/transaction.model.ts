
import { Model, raw, Transaction as DBTransaction } from 'objection';

import { User } from './user.model';


export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum TransactionCategory {
  TRANSFER = 'TRANSFER',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT'
}

export interface Transaction {
    readonly id: number;
    readonly amount: number;
    readonly sender: string;
    readonly reciever: string;
    readonly trans_type: TransactionType;
    readonly trans_category: TransactionCategory;
    readonly created_at: string;
    readonly updated_at: string;
}

export class TransactionModel extends Model implements Transaction {
  id!: number;
  amount!: number;
  sender!: string;
  reciever!: string;
  trans_type!: TransactionType;
  trans_category!: TransactionCategory;
  created_at!: string;
  updated_at!: string;
  balance!: number;

  static get tableName() {
    return 'lendsqr_transactions';
  }

  static async fundWallet(amount: number, user: User) {
    return this.query().insert({
    amount,
    trans_type: TransactionType.CREDIT,
    trans_category: TransactionCategory.DEPOSIT,
    reciever: user.id,
  })
  }

  static async balance(user: User, trx?: DBTransaction | undefined) {

    const balance = await this.query(trx)
    .select(raw(`SUM(CASE WHEN trans_type = '${TransactionType.CREDIT}' THEN amount ELSE -1 * amount END) as balance`))
    .where({reciever: user.id, trans_type: TransactionType.CREDIT})
    .orWhere({sender: user.id, trans_type: TransactionType.DEBIT})
    .first()

    if(balance?.balance) return balance

    return {balance: 0}
  }

  static history(user: User, offset: number, limit: number) {
    return this.query()
    .where({reciever: user.id, trans_type: TransactionType.CREDIT})
    .orWhere({sender: user.id, trans_type: TransactionType.DEBIT})
    .offset(offset || 0)
    .limit(limit || 20)
  }

  static async performWithdrawal({ trx, amount, user }: { trx: DBTransaction; amount: number; user: User }) {
    const userBalance = await this.balance(user, trx)

    if (userBalance.balance < amount) {
      return Promise.reject('Insufficient funds!'); 
    }

    return this.query().insert({
      amount,
      trans_type: TransactionType.DEBIT,
      trans_category: TransactionCategory.WITHDRAWAL,
      sender: user.id
    });
  }


  static async withdraw(amount: number, user: User) {      
      return this.transaction(trx => this.performWithdrawal({
        trx,
        amount,
        user
      }));
  }

  static async performTransfer({ trx, transferDetails, user }: { trx: DBTransaction; transferDetails: Pick<Transaction, "amount" | "reciever">, user: string}) {
        const userBalance = await this.balance({ id: user } as User, trx)        

        if (userBalance.balance < transferDetails.amount) {
          return Promise.reject('Insufficient funds!'); 
        }

        await this.query(trx).insert({
          amount: transferDetails.amount,
          trans_type: TransactionType.DEBIT,
          trans_category: TransactionCategory.TRANSFER,
          reciever: transferDetails.reciever,
          sender: user,
        });
      
        await this.query(trx).insert({
          amount: transferDetails.amount,
          trans_type: TransactionType.CREDIT,
          trans_category: TransactionCategory.TRANSFER,
          reciever: transferDetails.reciever,
          sender: user,
        });

        return { 
          amount: transferDetails.amount, 
          newBalance: userBalance.balance - transferDetails.amount 
        }
  }

  static transfer(transferDetails: Pick<Transaction, "amount" | "reciever">, user: Required<User>) {
      return this.transaction(trx => this.performTransfer({
        trx,
        transferDetails,
        user: user.id
      }))
  }

}
