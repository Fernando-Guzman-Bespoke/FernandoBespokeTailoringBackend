import express from 'express';
import { ensureAdminAuth, ensureAuth, ensureDoctorAuth } from '../../middleware/ensureAuth.js';
import {
    createMedicineController, createMiscellaneousController, getMedicineByPatientController,
    getSuppliesController,
    getSuppliesNearlyDepletedController,
    getSupplyDataController,
} from './supply.controller.js';
import validateBody from '../../middleware/validateBody.js';
import newSupplySchema from '../../helpers/validationSchemas/newSupplySchema.js';

const supplyRouter = express.Router();

supplyRouter.post('/newMedicine', ensureAdminAuth, validateBody(newSupplySchema), createMedicineController);
supplyRouter.post('/newMiscellaneous', ensureAdminAuth, validateBody(newSupplySchema), createMiscellaneousController);
supplyRouter.get('/medicineByPatient', ensureDoctorAuth, getMedicineByPatientController);
supplyRouter.get('/list', ensureDoctorAuth, getSuppliesController);
supplyRouter.get('/nearlyDepleted', ensureAdminAuth, getSuppliesNearlyDepletedController);
supplyRouter.get('/:supplyId', ensureAuth, getSupplyDataController);

export default supplyRouter;
