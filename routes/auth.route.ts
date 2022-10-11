// const router = require('express').Router();
import { Router } from 'express';

import {Validator} from '../middlewares/validator.middleware';
import SignupController from '../controllers/auth.controller';
import $ from 'express-async-handler';

const router = Router();



router.post(
	'/signup', 
	$(Validator(SignupController.registerSchema)), 
	$(SignupController.register)
);



export = router;