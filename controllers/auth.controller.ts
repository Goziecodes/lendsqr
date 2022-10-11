import joi from 'joi';
import {User} from '../models/user.model';

export default class SignupController {

	static get registerSchema() {
		return joi.object().keys({
			fullname: joi.string().required(),
			email: joi.string().email().required(),
			password: joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async register(req: any, res: any, next: any) {
		res.status(201).data( 'response' );
	}
};