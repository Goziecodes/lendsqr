import dotenv from "dotenv";
dotenv.config();

jest.mock('../utils/jwt', () => ({
    encode: jest.fn().mockReturnValue('tokenister')
}))
import { User, UserModel } from "./user.model";
import { KnexQueryBuilder } from '../__mocks__/knex';
process.env.JWTKEY = 'skadoosh'
import {encode} from '../utils/jwt'


describe('User Model', ()=> {
    afterEach(() => {
		jest.clearAllMocks();
	});


    describe('Login Method', () => {

        it('authenticates user if credentials match', async () => {
            const password = 'password';
            const hashedPassword = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
            const queryBuilder = KnexQueryBuilder({
                findOne: jest.fn().mockResolvedValueOnce({ 
                     id: '2', 
                     fullname: "chigozie ezechukwu",
                     password: hashedPassword,
                     email: 'ezechukwu@email.com'
                })
            })
            
            jest.spyOn(UserModel, 'query').mockReturnValue(queryBuilder as any)
    
            const result = await UserModel.loginUser({ email: 'ezechukwu@email.com', password } as User)
    
            expect(queryBuilder.findOne).toBeCalledWith({email: 'ezechukwu@email.com'})
            expect(encode).toBeCalledWith({
                id: '2', 
                email: 'ezechukwu@email.com'
            })
            expect(result).toEqual({
                token: 'tokenister',
            })
        });

        it('fails  if user not found', async () => {
            const password = 'password';
            const queryBuilder = KnexQueryBuilder({
                findOne: jest.fn().mockResolvedValueOnce(null)
            })
            
            jest.spyOn(UserModel, 'query').mockReturnValue(queryBuilder as any)

            try {
                await UserModel.loginUser({ email: 'ezechukwu@email.com', password } as User)
            } catch (error) {
                expect(queryBuilder.findOne).toBeCalledWith({email: 'ezechukwu@email.com'})
                expect(encode).toBeCalledTimes(0)
                expect(error).toEqual('Email or Password incorrect')    
            }
        });
 
        it('fails  if password not match', async () => {
            const password = 'wrongpassword';
            const hashedPassword = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'

            const queryBuilder = KnexQueryBuilder({
                findOne: jest.fn().mockResolvedValueOnce({ 
                    id: '2', 
                    fullname: "chigozie ezechukwu",
                    password: hashedPassword,
                    email: 'ezechukwu@email.com'
               })
            })
            
            jest.spyOn(UserModel, 'query').mockReturnValue(queryBuilder as any)

            try {
                await UserModel.loginUser({ email: 'ezechukwu@email.com', password } as User)
            } catch (error) {
                expect(queryBuilder.findOne).toBeCalledWith({email: 'ezechukwu@email.com'})
                expect(encode).toBeCalledTimes(0)
                expect(error).toEqual('Email or Password incorrect')    
            }
        });
     
        it('fails if no user found', async () => {
            const password = 'password';
            const queryBuilder = KnexQueryBuilder({
                findOne: jest.fn().mockResolvedValueOnce(null)
            })
            
            jest.spyOn(UserModel, 'query').mockReturnValue(queryBuilder as any)

            try {
                await UserModel.loginUser({ email: 'ezechukwu@email.com', password } as User)
            } catch (error) {
                expect(queryBuilder.findOne).toBeCalledWith({email: 'ezechukwu@email.com'})
               expect(error).toEqual("Email or Password incorrect")
            }
        });
  
    });

})


