import express from 'express';
import loginSchema from '../../helpers/validationSchemas/loginSchema.js';
import newDoctorSchema from '../../helpers/validationSchemas/newDoctorSchema.js';
import newUserSchema from '../../helpers/validationSchemas/newUserSchema.js';
import validateBody from '../../middleware/validateBody.js';
import {
    createAdminController, createDoctorController, getUsersListController, login,
    getDoctorsController, getUserDataController, updateUserController,
} from './user.controller.js';
import { ensureAdminAuth, ensureAuth, ensureDoctorAuth } from '../../middleware/ensureAuth.js';

const router = express.Router();

router.post('/createDoctor', validateBody(newUserSchema), validateBody(newDoctorSchema), createDoctorController);
router.post('/createAdmin', validateBody(newUserSchema), createAdminController);
router.post('/login', validateBody(loginSchema), login);
router.post('/validateToken', ensureAuth, (req, res) => res.sendStatus(200));
router.get('/list', ensureAdminAuth, getUsersListController);
router.get('/doctorList', ensureDoctorAuth, getDoctorsController);
router.get('/:userId', ensureAdminAuth, getUserDataController);
router.post('/update/:userId', ensureAdminAuth, updateUserController);

export default router;
