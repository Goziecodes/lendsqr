import dotenv from "dotenv";
dotenv.config();


import { TransactionCategory, TransactionModel, TransactionType } from "../models/transaction.model";
import { User } from "./user.model";
import { KnexQueryBuilder } from '../__mocks__/knex';
import Objection, { raw } from "objection";



describe('Transaction Model', ()=> {
    afterEach(() => {
		jest.clearAllMocks();
	});

    describe('FundWallet Method', () => {
  

        it('Funds user wallet with specified value', async () => {
            const insertSpy = jest.fn().mockImplementationOnce((args) => Promise.resolve({
                id: 10,
                ...args
            }))
            jest.spyOn(TransactionModel, 'query').mockReturnValue({
                insert: insertSpy
            } as any)
    
            const result = await TransactionModel.fundWallet(10, { id: '10' } as User)
    
            expect(insertSpy).toBeCalledWith({
                amount: 10,
                trans_type: "CREDIT",
                trans_category: "DEPOSIT",
                reciever: '10',
            })
            expect(result).toEqual({
                amount: 10,
                trans_type: "CREDIT",
                trans_category: "DEPOSIT",
                reciever: '10',
                id: 10
            })
        });
    });

    describe('Balance Method', () => {

        it('returns user balance', async () => {
            const queryBuilder = KnexQueryBuilder({
                first: jest.fn().mockResolvedValueOnce({ balance: 1000 })
            })
            jest.spyOn(TransactionModel, 'query').mockReturnValue(queryBuilder as any)
    
            const result = await TransactionModel.balance({ id: '10' } as User)
    
            expect(queryBuilder.select).toBeCalledWith(raw(`SUM(CASE WHEN trans_type = '${TransactionType.CREDIT}' THEN amount ELSE -1 * amount END) as balance`))
            expect(queryBuilder.where).toBeCalledWith({reciever: '10', trans_type: TransactionType.CREDIT})
            expect(queryBuilder.orWhere).toBeCalledWith({sender: '10', trans_type: TransactionType.DEBIT})
            expect(queryBuilder.first).toBeCalled()
            expect(result).toEqual({
                balance: 1000,
            })
        });
    
        it('returns the default 0 balance object if query is null', async () => {
            const queryBuilder = KnexQueryBuilder({
                first: jest.fn().mockResolvedValueOnce(null)
            })
            jest.spyOn(TransactionModel, 'query').mockReturnValue(queryBuilder as any)
    
            const result = await TransactionModel.balance({ id: '10' } as User)
    
            expect(queryBuilder.select).toBeCalledWith(raw(`SUM(CASE WHEN trans_type = '${TransactionType.CREDIT}' THEN amount ELSE -1 * amount END) as balance`))
            expect(queryBuilder.where).toBeCalledWith({reciever: '10', trans_type: TransactionType.CREDIT})
            expect(queryBuilder.orWhere).toBeCalledWith({sender: '10', trans_type: TransactionType.DEBIT})
            expect(queryBuilder.first).toBeCalled()
            expect(result).toEqual({
                balance: 0,
            })
        });
    });

    describe('History Method', () => {
        it('returns transaction history', async () => {
            const queryBuilder = KnexQueryBuilder({
                limit: jest.fn().mockResolvedValueOnce([
                    {
                        i: 1,
                        sender: null,
                        reciever: 12,
                        amount: 5000,
                        created_at: "2022-10-12T06:01:06.000Z",
                        updated_at: "2022-10-12T06:01:06.000Z",
                        trans_type: "CREDIT",
                        trans_category: "DEPOSIT"
                    },
                ])
            })
            jest.spyOn(TransactionModel, 'query').mockReturnValue(queryBuilder as any)
    
            const result = await TransactionModel.history({ id: '10' } as User, 0, 20)
    
            expect(queryBuilder.where).toBeCalledWith({reciever: '10', trans_type: TransactionType.CREDIT})
            expect(queryBuilder.orWhere).toBeCalledWith({sender: '10', trans_type: TransactionType.DEBIT})
            expect(queryBuilder.offset).toBeCalledWith(0)
            expect(queryBuilder.limit).toBeCalledWith(20)
            expect(result).toEqual([{
                i: 1,
                sender: null,
                reciever: 12,
                amount: 5000,
                created_at: "2022-10-12T06:01:06.000Z",
                updated_at: "2022-10-12T06:01:06.000Z",
                trans_type: "CREDIT",
                trans_category: "DEPOSIT"
            }])
        });
    });

    describe('Transfer', () => {
        it('Can tranfer when user\'s balance is greater than or equal to amount', async () => {
            const amount = 5000;
            const transferDetails = {
                amount,
                reciever: '20'
            };
            const user = { id: '50' }
            const trx = {} as Objection.Transaction;
            const balanceSpy = jest.spyOn(TransactionModel, 'balance').mockResolvedValueOnce({
                balance: amount + 100
            });
            const insertSpy = jest.fn()
            insertSpy.mockImplementation((args) => Promise.resolve({
                id: 10,
                ...args
            }))
            const querySpy = jest.spyOn(TransactionModel, 'query').mockReturnValue({
                insert: insertSpy
            } as any)

            const result = await TransactionModel.performTransfer({
                trx,
                transferDetails,
                user: user.id
            })

            expect(querySpy).toBeCalledWith(trx);
            expect(insertSpy).toBeCalledTimes(2);
            expect(insertSpy.mock.calls[0][0]).toEqual({
                amount: transferDetails.amount,
                trans_type: TransactionType.DEBIT,
                trans_category: TransactionCategory.TRANSFER,
                reciever: transferDetails.reciever,
                sender: user.id,
            })

            expect(insertSpy.mock.calls[1][0]).toEqual({
                amount: transferDetails.amount,
                trans_type: TransactionType.CREDIT,
                trans_category: TransactionCategory.TRANSFER,
                reciever: transferDetails.reciever,
                sender: user.id,
            })

            expect(balanceSpy).toBeCalledWith({id: user.id}, trx);
            expect(result).toEqual({
                amount: transferDetails.amount, 
                newBalance: 100 
            })
        });

        it('Can\'t tranfer when user\'s balance is less than  amount', async () => {
            const amount = 5000;
            const transferDetails = {
                amount,
                reciever: '20'
            };
            const user = { id: '50' }
            const trx = {} as Objection.Transaction;
            const balanceSpy = jest.spyOn(TransactionModel, 'balance').mockResolvedValueOnce({
                balance: amount - 100
            });

            try {
                await TransactionModel.performTransfer({
                    trx,
                    transferDetails,
                    user: user.id
                })
            } catch(error) {
                expect(balanceSpy).toBeCalledWith({id: user.id}, trx);
                expect(error).toEqual('Insufficient funds!')
            }

        });
    });

    describe('Withdrawal', () => {
        it('withdraws when amount is greater than or equal to user balance', async () => {
            const amount = 6000;
            const balanceSpy = jest.spyOn(TransactionModel, 'balance').mockResolvedValueOnce({
                balance: amount + 100
            });
            const trx = {} as Objection.Transaction;
            const user = { id: '50' } as User
            const insertSpy = jest.fn()
            insertSpy.mockImplementation((args) => Promise.resolve({
                id: 10,
                ...args
            }))
            const querySpy = jest.spyOn(TransactionModel, 'query').mockReturnValue({
                insert: insertSpy
            } as any);

            const result = await TransactionModel.performWithdrawal({
                trx,
                amount,
                user
            });

            expect(balanceSpy).toBeCalled();
            expect(result).toEqual({
                id: 10,
                amount,
                trans_type: TransactionType.DEBIT,
                trans_category: TransactionCategory.WITHDRAWAL,
                sender: user.id
            });
        })

        it('can\'t when amount is less than user balance', async () => {
            const amount = 6000;
            const balanceSpy = jest.spyOn(TransactionModel, 'balance').mockResolvedValueOnce({
                balance: amount - 100
            });
            const trx = {} as Objection.Transaction;
            const user = { id: '50' } as User
            const insertSpy = jest.fn()
            insertSpy.mockImplementation((args) => Promise.resolve({
                id: 10,
                ...args
            }))
            jest.spyOn(TransactionModel, 'query').mockReturnValue({
                insert: insertSpy
            } as any);

            try {
                await TransactionModel.performWithdrawal({
                    trx,
                    amount,
                    user
                });
            } catch(error) {
                expect(balanceSpy).toBeCalled();
                expect(error).toEqual('Insufficient funds!');
            }

        })
    });
})


