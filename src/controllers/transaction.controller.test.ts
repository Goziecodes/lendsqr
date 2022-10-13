import dotenv from "dotenv";
dotenv.config();

import { mockNext, mockRequest, mockResponse } from "../__mocks__/http";
import { TransactionController } from "./transaction.controller";
import TransactionService from "../services/transaction.service";
import { TransactionModel } from "../models/transaction.model";

describe("Fund wallet Method", () => {
  it("Can fund Wallet", async () => {
    const req = mockRequest({
      body: {
        amount: 2000,
      },
      user: { id: '10' },
    });

    const res = mockResponse();

    const fundWalletSpy = jest.spyOn(TransactionService, "fundWallet");
    fundWalletSpy.mockResolvedValueOnce({
        amount: 2000,
        trans_type: "CREDIT",
        trans_category: "DEPOSIT",
        reciever: '12',
        id: 2
    }  as unknown as TransactionModel);

    await TransactionController.fundWallet(req, res, mockNext);

    expect(res.data).toBeCalledWith({
        amount: 2000,
        trans_type: "CREDIT",
        trans_category: "DEPOSIT",
        reciever: '12',
        id: 2
    });

    expect(fundWalletSpy).toBeCalledWith(2000, { id: '10' }); 

  });
});


describe("get balance Method", ()=>{
    it("can get balance", async () => {
        const req = mockRequest({
            user: { id: '10' },
          });

          const res = mockResponse();

          const getBalanceSpy = jest.spyOn(TransactionService, "balance");

          getBalanceSpy.mockResolvedValueOnce({
            balance: 2000
          })

          await TransactionController.balance(req, res, mockNext)

          expect(res.data).toBeCalledWith({balance: 2000})
          expect (getBalanceSpy).toBeCalledWith({id: "10"})

    })
})

describe("get history Method", ()=>{
    it("can get transaction histor", async () => {
        const req = mockRequest({
            user: {id: "10"},
            query: {
                offset: "3",
                limit: "60",
              }
          });

          const res = mockResponse();

          const getHistorySpy = jest.spyOn(TransactionService, "history");

          getHistorySpy.mockResolvedValueOnce([{
            id: 1,
            reciever: '12',
            amount: 5000,
            created_at: "2022-10-12T06:01:06.000Z",
            updated_at: "2022-10-12T06:01:06.000Z",
            trans_type: "CREDIT",
            trans_category: "DEPOSIT"
        } as unknown as TransactionModel])

          await TransactionController.history(req, res, mockNext)

          expect(res.data).toBeCalledWith([{
            id: 1,
            reciever: '12',
            amount: 5000,
            created_at: "2022-10-12T06:01:06.000Z",
            updated_at: "2022-10-12T06:01:06.000Z",
            trans_type: "CREDIT",
            trans_category: "DEPOSIT"
        }])

        expect (getHistorySpy).toBeCalledWith({id: "10"}, "3", "60")

    })
})

describe("withdraw Method", ()=>{
    it("can withdraw", async () => {
        const req = mockRequest({
            user: {id: "10"},
            body: {amount: 1000},
          });

          const res = mockResponse();

          const withdrawSpy = jest.spyOn(TransactionService, "withdraw");

          withdrawSpy.mockResolvedValueOnce({
            amount: 500,
            trans_type: "DEBIT",
            trans_category: "WITHDRAWAL",
            sender: '12',
            id: 7
        } as TransactionModel)

          await TransactionController.withdraw(req, res, mockNext)

          expect(res.data).toBeCalledWith({
            amount: 500,
            trans_type: "DEBIT",
            trans_category: "WITHDRAWAL",
            sender: '12',
            id: 7
        } as TransactionModel)

        expect (withdrawSpy).toBeCalledWith(1000, {id: "10"})

    })

    it("fails if balance is insufficient", async () => {
        const req = mockRequest({
            user: {id: "10"},
            body: {amount: 1000},
          });

          const res = mockResponse();

          const withdrawSpy = jest.spyOn(TransactionService, "withdraw");

          withdrawSpy.mockRejectedValueOnce("Insufficient funds!")

          try {
            await TransactionController.withdraw(req, res, mockNext)

          } catch (e) {
            expect(e).toEqual('Insufficient funds!')
            expect(res.data).toBeCalledTimes(0);
          }
    })

    it("fails if user does not exist", async () => {
        const req = mockRequest({
            user: {id: "10"},
            body: {amount: 1000},
          });

          const res = mockResponse();

          const withdrawSpy = jest.spyOn(TransactionService, "withdraw");

          withdrawSpy.mockRejectedValueOnce("User not found!")

          try {
            await TransactionController.withdraw(req, res, mockNext)

          } catch (e) {
            expect(e).toEqual('User not found!')
            expect(res.data).toBeCalledTimes(0);
          }
    })
})

describe("transfer Method", ()=>{
    it("can transfer funds", async () => {
        const req = mockRequest({
            user: {id: "10"},
            body: {amount: 1000, reciever: 13},
          });

          const res = mockResponse();

          const transferSpy = jest.spyOn(TransactionService, "transfer");

          transferSpy.mockResolvedValueOnce({ amount: 1000, newBalance: 50 })

          await TransactionController.transfer(req, res, mockNext)

          expect(res.data).toBeCalledWith({ amount: 1000, newBalance: 50 })
          expect(res.status).toBeCalledWith(201)

        expect (transferSpy).toBeCalledWith({amount: 1000, reciever: 13}, {id: "10"})

    })
    it("fails if reciever does not exist", async () => {
        const req = mockRequest({
            user: {id: "10"},
            body: {amount: 1000, reciever: 13},
          });

          const res = mockResponse();

          const transferSpy = jest.spyOn(TransactionService, "transfer");

          transferSpy.mockRejectedValueOnce("that user is yet to join our platform, maybe send a signup link to them first?")

          try {
            await TransactionController.transfer(req, res, mockNext)
          } catch (e) {
            expect(res.data).toBeCalledTimes(0)
            expect(e).toEqual('that user is yet to join our platform, maybe send a signup link to them first?')
            expect (transferSpy).toBeCalledWith({amount: 1000, reciever: 13}, {id: "10"})
          }
    })
    it("fails if balance insufficient", async () => {
        const req = mockRequest({
            user: {id: "10"},
            body: {amount: 1000, reciever: 13},
          });

          const res = mockResponse();

          const transferSpy = jest.spyOn(TransactionService, "transfer");

          transferSpy.mockRejectedValueOnce("Insufficient funds!")

          try {
            await TransactionController.transfer(req, res, mockNext)
          } catch (e) {
            expect(res.data).toBeCalledTimes(0)
            expect(e).toEqual('Insufficient funds!')
            expect (transferSpy).toBeCalledWith({amount: 1000, reciever: 13}, {id: "10"})
          }
    })
})

