import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { IExpressRequest, IExpressResponse } from '../interfaces';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import TransactionService from '../services/transaction.service'

export class TransactionController {
    static get fundSchema() {
		return joi.object().keys({
			amount: joi.number().positive().required(),
		});
	}
    
    static get transferSchema() {
		return joi.object().keys({
			amount: joi.number().positive().required(),
            reciever: joi.string().required(),
		});
	}


	// eslint-disable-next-line no-unused-vars
	static async fundWallet(req: IExpressRequest | Request, res: IExpressResponse | Response, next: NextFunction) {
        const user = (req as IExpressRequest).user;
		const transaction = await TransactionService.fundWallet(req.body.amount as number, user as User);
		(res.status(201) as IExpressResponse).data(transaction);
	}

	static async balance(req: IExpressRequest | Request, res: IExpressResponse | Response, next: NextFunction) {
        const user = (req as IExpressRequest).user;
		const balance = await TransactionService.balance(user as User);
		(res.status(200) as IExpressResponse).data(balance);
	}
	
    static async withdraw(req: IExpressRequest | Request, res: IExpressResponse | Response, next: NextFunction) {
        const user = (req as IExpressRequest).user;
		const transaction = await TransactionService.withdraw(req.body.amount as number, user as User);
		(res.status(201) as IExpressResponse).data(transaction);
	}

    static async transfer(req: IExpressRequest | Request, res: IExpressResponse | Response, next: NextFunction) {
        const user = (req as IExpressRequest).user;
		const transaction = await TransactionService.transfer(req.body as Pick<Transaction, 'amount' | 'reciever'>, user as User);
		(res.status(201) as IExpressResponse).data(transaction);
	}
};