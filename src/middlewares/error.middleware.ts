import { NextFunction, Request, Response } from 'express';
import { IExpressResponse } from './interfaces';

// eslint-disable-next-line no-unused-vars
export default  (err: { type: string; toString: () => string; }, req: Request, res: IExpressResponse | Response, next: NextFunction) => {
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-console
		console.error(err, ":ERROR");
	}

	if (err.type && err.type === 'entity.parse.failed') {
		(res.status(400) as IExpressResponse).error('Invalid JSON payload passed.');
	} else if (err.toString() === '[object Object]') {
		try{
			(res.status(400) as IExpressResponse).error(err);
		} catch {
			(res.status(500) as IExpressResponse).error('Server error');
		}
	} else {
		(res.status(400) as IExpressResponse).error(err.toString());
	}
};
