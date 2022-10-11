import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { IExpressResponse } from '../interfaces';
import { User } from '../models/user.model';
import authService from '../services/auth.service'

export class AuthController {

	static get registerSchema() {
		return joi.object().keys({
			fullname: joi.string().required(),
			email: joi.string().email().required(),
			password: joi.string().required()
		});
	}
	static get loginSchema() {
		return joi.object().keys({
			email: joi.string().email().required(),
			password: joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async register(req: Request, res: IExpressResponse | Response, next: NextFunction) {
		const user = await authService.createUser(req.body as Partial<User>);
		(res.status(201) as IExpressResponse).data(user);
	}

	static async login(req: Request, res: IExpressResponse | Response, next: NextFunction) {
		const user = await authService.login(req.body as Pick<User, "email" | "password">);
		(res.status(201) as IExpressResponse).data(user);
	}
};