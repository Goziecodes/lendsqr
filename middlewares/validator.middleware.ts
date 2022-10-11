import joi from 'joi';
import { Request, Response, NextFunction} from 'express'
import { IExpressResponse } from '../interfaces';

/**
 * reducer callback function to turn joi error message into a simple object
 * it takes the label or key property and makes it a key in the accumulatedObject
 * while the value of the key would be the error message
 * @param {Object} accumulatedObject
 * @param {Object} currentError
 */
const reducer = (accumulatedObject: any, currentError: { context: { label: any; key: any; }; message: string; }) => Object.assign(accumulatedObject, {
	[currentError.context.label || currentError.context.key]: currentError.message.replace(new RegExp('"', 'ig'), ''),
});

/**
 * takes in a joi validation schema
 * and returns a middleware to run a preconfigued joi validator
 * @param {JoiSchema} schema
 * @returns middleware
 */
export const Validator = (schema: joi.Schema) => async (req: Request, res: IExpressResponse | Response, next: NextFunction) => {
	try {
		const value = await joi.attempt(req.body || {}, schema, {
			abortEarly: false,
			convert: true,
			stripUnknown: true,
		});
		// refined request body
		req.body = value;
		next();
	} catch (error: any) {
		// refined error message
		(res.status(400) as IExpressResponse).error(!error.details ? error.message : error.details.reduce(reducer, {}));
	}
};