import { JsonWebTokenError } from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";

import * as JWT  from "../utils/jwt";
import { mockNext, mockRequest, mockResponse } from "../__mocks__/http";
import { KnexQueryBuilder } from "../__mocks__/knex";
import authMiddleware from './auth.middleware'

describe('Auth MIddleWare', ()=>{
    it('returns error if Authorization header is missing', async () => {
		const req = mockRequest({
		});
		const res = mockResponse();


        try {
            await authMiddleware(req, res, mockNext);
        } catch (e) {
            expect(res.data).toBeCalledTimes(0)
            expect(res.status).toBeCalledWith(401)
            expect(e).toEqual('Please provide a valid access token')
        }
	});

    it('returns error if Authorization header cannot be decoded', async () => {
		const req = mockRequest({
            headers: {
				Authorization: 'Bearer wrongtoken....'
			}
		});
		const res = mockResponse();
        const decode = jest.spyOn(JWT, 'decode').mockImplementationOnce((args: string) => {
            throw new JsonWebTokenError('jwt malformed')
        })

        
        try {
            await authMiddleware(req, res, mockNext);
        } catch (e) {
            expect(decode).toBeCalledWith('wrongtoken....')
            expect(res.status).toBeCalledWith(403)
            expect(e).toEqual('invalid Token provided')
        }
	});

    it('returns error if Authorization header did not start with bearer', async () => {
		const req = mockRequest({
            headers: {
				Authorization: 'wrongtoken....'
			}
		});
		const res = mockResponse();
        const decode = jest.spyOn(JWT, 'decode')

        
        try {
            await authMiddleware(req, res, mockNext);
        } catch (e) {
            expect(decode).toBeCalledTimes(0)
            expect(res.status).toBeCalledWith(401)
            expect(e).toEqual('Please provide a valid access token')
        }
	});

    it('returns error if user decoded from payload is not found', async () => {
        const req = mockRequest({
            headers: {
				Authorization: 'Bearer wrongtoken....'
			}
		});
		const res = mockResponse();
        const queryBuilder = KnexQueryBuilder({
            findOne: jest.fn().mockResolvedValueOnce(null)
        })
        const decode = jest.spyOn(JWT, 'decode').mockReturnValueOnce({
            email: 'thanos@who.com'
        })
        
        jest.spyOn(UserModel, 'query').mockReturnValue(queryBuilder as any)

        
        try {
            await authMiddleware(req, res, mockNext);
        } catch (e) {
            expect(decode).toBeCalledWith('wrongtoken....')
            expect(res.status).toBeCalledWith(403)
            expect(e).toEqual('Please provide a valid access token')
        }
    })

    it('move to next route if user decoded from payload', async () => {
        const req = mockRequest({
            headers: {
				Authorization: 'Bearer wrongtoken....'
			}
		});
		const res = mockResponse();
        const next = jest.fn();
        const queryBuilder = KnexQueryBuilder({
            findOne: jest.fn().mockResolvedValueOnce({
                email: 'thanos@who.com',
                fullname: 'Thanos for some reason',
                id: '1'  
            })
        })
        const decode = jest.spyOn(JWT, 'decode').mockReturnValueOnce({
            email: 'thanos@who.com'
        })
        
        jest.spyOn(UserModel, 'query').mockReturnValue(queryBuilder as any)
        
        await authMiddleware(req, res, next);
        
        expect(decode).toBeCalled()
        expect(req.user).toEqual({
            email: 'thanos@who.com',
            fullname: 'Thanos for some reason',
            id: '1'  
        })
        expect(queryBuilder.findOne).toBeCalledWith({
            email: 'thanos@who.com'
        });
        expect(next).toBeCalled()

    })
})

