import express from 'express';
import loginSchema from '../../helpers/validationSchemas/loginSchema.js';
import newUserSchema from '../../helpers/validationSchemas/newUserSchema.js';
import validateBody from '../../middleware/validateBody.js';
import {
    createAdminController, getUsersListController, login,
    getUserDataController, getClientController
} from './user.controller.js';
import { ensureAdminAuth, ensureAuth, ensureDoctorAuth } from '../../middleware/ensureAuth.js';

const router = express.Router();

router.post('/createAdmin', validateBody(newUserSchema), createAdminController);
router.post('/login', validateBody(loginSchema), login);
router.post('/validateToken', ensureAuth, (req, res) => res.sendStatus(200));
router.get('/list', ensureAdminAuth, getUsersListController);
router.get('/clientList', getClientController);
router.get('/:userId', ensureAdminAuth, getUserDataController);

export default router;
