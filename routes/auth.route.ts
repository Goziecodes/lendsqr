// const router = require('express').Router();
import { Router } from 'express';

import {Validator} from '../middlewares/validator.middleware';
import authController from '../controllers/auth.controller';
import $ from 'express-async-handler';

const router = Router();



router.post(
	'/signup', 
	$(Validator(authController.registerSchema)), 
	$(authController.register)
);



export = router;