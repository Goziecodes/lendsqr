import {Transaction, TransactionModel} from '../models/transaction.model';
import {User, UserModel} from '../models/user.model'


export default class TransactionService {
	static fundWallet(amount: number, user: User ) {
        return TransactionModel.fundWallet(amount, user)
	}

	static balance(user: User ) {
        return TransactionModel.balance(user)
	}
	
	static history(user: User, offset: number, limit: number ) {
        return TransactionModel.history(user, offset, limit)
	}

	static async withdraw(amount: number, user: User ) {
		const userExists = await UserModel.query().findOne({id: user.id});
		if(!userExists) return Promise.reject('User not found!'); 
        return TransactionModel.withdraw(amount, user)
	}

	static async transfer(transferDetails: Pick<Transaction, "amount" | "reciever">, user: User ) {
		const userExists = await UserModel.query().findOne({id: transferDetails.reciever});
		if(!userExists) return Promise.reject('that user is yet to join our platform, maybe send a signup link to them first?'); 

		if(userExists.id === user.id) return Promise.reject(' sorry you cant transfer funds to yourself, wouldnt that be nice though!'); 
        return TransactionModel.transfer(transferDetails, user)
	}

};