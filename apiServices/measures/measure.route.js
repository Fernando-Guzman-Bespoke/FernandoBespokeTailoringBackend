import express from 'express';
import validateBody from '../../middleware/validateBody.js';
import {
    createMedidaController,
} from './measure.controller.js';
import { ensureAdminAuth, ensureAuth, ensureDoctorAuth } from '../../middleware/ensureAuth.js';

const router = express.Router();

router.post('/createMedida', createMedidaController);


export default router;
