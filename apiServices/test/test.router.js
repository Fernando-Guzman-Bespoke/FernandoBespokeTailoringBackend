import express from 'express';
import validateBody from '../../middleware/validateBody.js';
import { ensureAdminAuth, ensureAuth, ensureDoctorAuth } from '../../middleware/ensureAuth.js';
import newTestTypeSchema from '../../helpers/validationSchemas/newTestTypeSchema.js';
import {
    createTestController,
    createTestTypeController,
    getTestDataController,
    getTestTypesController,
    getTestsByPatientController,
    updateTestController,
} from './test.controller.js';
import newTestSchema from '../../helpers/validationSchemas/newTestSchema.js';
import updateTestSchema from '../../helpers/validationSchemas/updateTestSchema.js';

const testRouter = express.Router();

testRouter.post(
    '/newType',
    ensureAdminAuth,
    validateBody(newTestTypeSchema),
    createTestTypeController,
);
testRouter.post('/newTest', ensureDoctorAuth, validateBody(newTestSchema), createTestController);
testRouter.get('/testsByPatient', ensureDoctorAuth, getTestsByPatientController);
testRouter.get('/types', ensureAuth, getTestTypesController);
testRouter.get('/:testId', ensureDoctorAuth, getTestDataController);
testRouter.post('/update', ensureDoctorAuth, validateBody(updateTestSchema), updateTestController);

export default testRouter;
