import { NextFunction, Request, Response } from 'express';
import { IExpressRequest, IExpressResponse } from '../interfaces';
import { User } from '../models/user.model';

export const mockResponse = () => {
	const res = {} as Pick<IExpressResponse, 'status' | 'json' | 'data' | 'error' | 'errorMessage'>;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.data = jest.fn().mockReturnValue(res);
	res.error = jest.fn().mockReturnValue(res);
	res.errorMessage = jest.fn().mockReturnValue(res);
	return res as IExpressResponse;
};

export type mockRequestParams = {
    body?: Record<string, unknown>;
    params?: Record<string, string>;
    user?: Partial<User>;
    query?: Record<string, string>;
    headers?: Record<string, string>;
    method?: string;
    originalUrl?: string
}

export const mockRequest = ({
	body = {},
	params = {},
	user = {},
	query = {},
	headers = {},
	method = 'GET',
	originalUrl = '/',
}: mockRequestParams = {}) => {
    return {
        body,
        params,
        user,
        method,
        originalUrl,
        headers,
        query,
        get: (arg: string) => headers[arg],
    } as IExpressRequest
};

export const mockNext: NextFunction  = () => {}
