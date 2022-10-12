import {Transaction, TransactionModel} from '../models/transaction.model';
import {User} from '../models/user.model'


export default class TransactionService {
	static fundWallet(amount: number, user: User ) {
        return TransactionModel.fundWallet(amount, user)
	}

	static balance(user: User ) {
        return TransactionModel.balance(user)
	}
	
	static history(user: User ) {
        return TransactionModel.history(user)
	}

	static withdraw(amount: number, user: User ) {
        return TransactionModel.withdraw(amount, user)
	}

	static transfer(transferDetails: Pick<Transaction, "amount" | "reciever">, user: User ) {
        return TransactionModel.transfer(transferDetails, user)
	}

};