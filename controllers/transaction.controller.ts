import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { IExpressResponse } from '../interfaces';
import { Transaction } from '../models/transaction.model';
import transactionService from '../services/transaction.service'

export class TransactionController {
    static get fundSchema() {
		return joi.object().keys({
			amount: joi.number().positive().required(),
		});
	}


	// eslint-disable-next-line no-unused-vars
	static async fundWallet(req: Request, res: IExpressResponse | Response, next: NextFunction) {
		const user = await transactionService.fundWallet(req.body as Partial<Transaction>);
		(res.status(201) as IExpressResponse).data(user);
	}
};