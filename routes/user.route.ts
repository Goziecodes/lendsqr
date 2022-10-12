// const router = require('express').Router();
import { Router } from 'express';

import { UsersController } from '../controllers/users.controller';
import $ from 'express-async-handler';

const router = Router();

router.get(
	'/', 
	$(UsersController.users)
);




export default router;