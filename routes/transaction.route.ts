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

export default router;