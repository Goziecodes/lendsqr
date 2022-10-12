// const router = require('express').Router();
import { Router } from 'express';

import {Validator} from '../middlewares/validator.middleware';
import { AuthController } from '../controllers/auth.controller';
import $ from 'express-async-handler';

const router = Router();



router.post(
	'/signup', 
	$(Validator(AuthController.registerSchema)), 
	$(AuthController.register)
);
router.post(
	'/login', 
	$(Validator(AuthController.loginSchema)), 
	$(AuthController.login)
);



export default router;