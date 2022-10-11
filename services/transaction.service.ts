import {Transaction, TransactionModel} from '../models/transaction.model';


export default class TransactionService {
	static  fundWallet(amount: Partial<Transaction>) {
        return TransactionModel.fundWallet(amount)
	}

};