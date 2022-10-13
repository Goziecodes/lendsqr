import dotenv from 'dotenv';
dotenv.config();


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

	it('return error if email or password is wrong', async () => {
		const req = mockRequest({
			body: {
				email: 'loki@avengers.com',
				password: 'password'
			}
		});
		const res = mockResponse();

		const userLoginSpy = jest.spyOn(AuthService, 'login');
		userLoginSpy.mockRejectedValueOnce('Email or Password incorrect');

		try {
			await AuthController.login(req, res, mockNext);
		} catch(e) {
			expect(userLoginSpy).toBeCalledWith({
				email: 'loki@avengers.com',
				password: 'password'
			});
			expect(e).toEqual('Email or Password incorrect')
	
			expect(res.data).toBeCalledTimes(0);
		}

	});
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

	it('Cant Register user if email is not unique', async () => {
		const req = mockRequest({
			body: {
				email: 'ironman@avengers.com',
				password: 'password',
				fullname: 'Tony Stark'
			}
		});
		const res = mockResponse();

		const userRegisterSpy = jest.spyOn(AuthService, 'createUser');
		userRegisterSpy.mockRejectedValueOnce('Email already exists');

		try {
			await AuthController.register(req, res, mockNext);
		} catch (e) {
			expect(userRegisterSpy).toBeCalledWith({
				email: 'ironman@avengers.com',
				password: 'password',
				fullname: 'Tony Stark'
			});
			expect(e).toEqual('Email already exists')
	
			expect(res.data).toBeCalledTimes(0);
		}
	});

	it('Cant Register user if params are missing', async () => {
		const req = mockRequest({
			body: {
				
			}
		});
		const res = mockResponse();

		const userRegisterSpy = jest.spyOn(AuthService, 'createUser');
		userRegisterSpy.mockRejectedValueOnce({
			fullname: "fullname is required",
			email: "email is required",
			password: "password is required"
		});

		try {
			await AuthController.register(req, res, mockNext);
		} catch (e) {
			expect(userRegisterSpy).toBeCalledWith({
				
			});
			expect(e).toEqual({
				fullname: "fullname is required",
				email: "email is required",
				password: "password is required"
			})
	
			expect(res.data).toBeCalledTimes(0);
		}
	});

});
