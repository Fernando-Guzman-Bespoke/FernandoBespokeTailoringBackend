import express from 'express';
import validateBody from '../../middleware/validateBody.js';
import newMedicalCenterSchema from '../../helpers/validationSchemas/newMedicalCenterSchema.js';
import {
    addSuppliesToStockController,
    createMedicalCenterController,
    getDoctorsByMedicalCenterController,
    getMedicalCenterDataController,
    getMedicalCentersListController,
    getMedicineByMedicalCenterController,
    getSuppliesByMedicalCenterController,
    getSupplyInStockController,
    getUnstockedSuppliesController,
    updateSuppliesInStockController,
} from './medicalCenter.controller.js';
import { ensureAdminAuth, ensureAuth } from '../../middleware/ensureAuth.js';
import addStockSchema from '../../helpers/validationSchemas/addStockSchema.js';

const medicalCenterRouter = express.Router();

medicalCenterRouter.post('/', validateBody(newMedicalCenterSchema), createMedicalCenterController);
medicalCenterRouter.post(
    '/addStock',
    ensureAdminAuth,
    validateBody(addStockSchema),
    addSuppliesToStockController,
);
medicalCenterRouter.get('/', ensureAuth, getMedicalCentersListController);
medicalCenterRouter.get(
    '/:medicalCenterId/doctors',
    ensureAuth,
    getDoctorsByMedicalCenterController,
);

medicalCenterRouter.get(
    '/:medicalCenterId/medicines',
    ensureAuth,
    getMedicineByMedicalCenterController,
);
medicalCenterRouter.get('/:medicalCenterId', ensureAuth, getMedicalCenterDataController);
medicalCenterRouter.get(
    '/:medicalCenterId/unstockedSupplies',
    ensureAdminAuth,
    getUnstockedSuppliesController,
);
medicalCenterRouter.get(
    '/:medicalCenterId/supplies',
    ensureAdminAuth,
    getSuppliesByMedicalCenterController,
);
medicalCenterRouter.post(
    '/updateStock',
    ensureAdminAuth,
    validateBody(addStockSchema),
    updateSuppliesInStockController,
);
medicalCenterRouter.get(
    '/:medicalCenterId/stock/:supplyId',
    ensureAdminAuth,
    getSupplyInStockController,
);

export default medicalCenterRouter;
