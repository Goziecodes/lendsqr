import { NextFunction, Request, Response } from 'express';
import { IExpressResponse } from '../middlewares/interfaces';
import userService from '../services/user.service'

export class UsersController {

	// eslint-disable-next-line no-unused-vars
	static async users(req: Request, res: IExpressResponse | Response, next: NextFunction) {
		const { offset, limit} = req.query as unknown as Record<string, number>
		const users = await userService.getUsers(offset, limit);
		(res.status(200) as IExpressResponse).data(users);
	}
};