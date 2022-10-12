// const router = require('express').Router();
import { Router } from 'express';

import {Validator} from '../middlewares/validator.middleware';
import { TransactionController } from '../controllers/transaction.controller';
import $ from 'express-async-handler';

const router = Router();

router.post(
	'/deposit', 
	$(Validator(TransactionController.fundSchema)), 
	$(TransactionController.fundWallet)
);

router.get(
	'/balance', 
	$(TransactionController.balance)
);

router.post(
	'/withdraw', 
	$(Validator(TransactionController.fundSchema)), 
	$(TransactionController.withdraw)
);

router.post(
	'/transfer', 
	$(Validator(TransactionController.transferSchema)), 
	$(TransactionController.transfer)
);


export default router;