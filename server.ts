import express, { Express, Request, Response } from 'express';
import authMiddleware from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';

const app: Express = express();

import authRoutes from './routes/auth.route';
import transactionRoutes from './routes/transaction.route';



const customExpress = Object.create(express().response, {
	data: {
		value(data: any) {
			return this.type('json').json({
				status: 'success',
				data,
			});
		},
	},
	error: {
		value(error: any, message = 'An error occured') {
			return this.json({
				message,
				status: 'error',
				error,
			});
		},
	},
	errorMessage: {
		value(message = 'API response message') {
			return this.json({
				message,
				status: 'error',
			});
		},
	},
});

app.use(express.json());
app.use(express.urlencoded({
	extended: false,
}));

app.use(authRoutes);
app.use('/transactions', authMiddleware, transactionRoutes);
app.use(errorMiddleware);

app.response = Object.create(customExpress);


export default app
