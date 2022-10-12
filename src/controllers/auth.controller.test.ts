import dotenv from 'dotenv';
dotenv.config();

jest.mock('../models/user.model.ts', () => jest.fn());
import { mockNext, mockRequest, mockResponse } from '../__mocks__/http';
import { AuthController }  from './auth.controller';
import AuthService from '../services/auth.service'

describe('Login Method', () => {
	it('Can Login if email and password is correct', async () => {
		const req = mockRequest({
			body: {
				email: 'ironman@avengers.com',
				password: 'password'
			}
		});
		const res = mockResponse();

		const userLoginSpy = jest.spyOn(AuthService, 'login');
		userLoginSpy.mockResolvedValueOnce({ token: '...and I, am Iron man' });

		await AuthController.login(req, res, mockNext);

		expect(userLoginSpy).toBeCalledWith({
			email: 'ironman@avengers.com',
			password: 'password'
		});

		expect(res.data).toBeCalledWith({
			token: '...and I, am Iron man'
		});
	});
	// if email is wrong
	// if password is wrong
});


describe('Registered Method', () => {
	it('Can Register user if email is unique', async () => {
		const req = mockRequest({
			body: {
				email: 'ironman@avengers.com',
				password: 'password',
				fullname: 'Tony Stark'
			}
		});
		const res = mockResponse();

		const userRegisterSpy = jest.spyOn(AuthService, 'createUser');
		userRegisterSpy.mockResolvedValueOnce({
			id: '1',
			email: 'ironman@avengers.com',
			fullname: 'Tony Stark'
		});

		await AuthController.register(req, res, mockNext);

		expect(userRegisterSpy).toBeCalledWith({
			email: 'ironman@avengers.com',
			password: 'password',
			fullname: 'Tony Stark'
		});

		expect(res.data).toBeCalledWith({
			email: 'ironman@avengers.com',
			id: '1',
			fullname: 'Tony Stark'
		});
	});
	// if email is not unique
	// params are missing
});
