import {Transaction, TransactionModel} from '../models/transaction.model';
import {User} from '../models/user.model'


export default class TransactionService {
	static fundWallet(amount: number, user: User ) {
        return TransactionModel.fundWallet(amount, user)
	}

};