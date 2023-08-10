import express from 'express';
import validateBody from '../../middleware/validateBody.js';
import newPatientSchema from '../../helpers/validationSchemas/newPatientSchema.js';
import { ensureDoctorAuth } from '../../middleware/ensureAuth.js';
import { getPatientDataController, getPatientsController, newPatientController } from './patient.controller.js';

const patientRouter = express.Router();

patientRouter.post('/new', ensureDoctorAuth, validateBody(newPatientSchema), newPatientController);
patientRouter.get('/list', ensureDoctorAuth, getPatientsController);
patientRouter.get('/:patientId', ensureDoctorAuth, getPatientDataController);

export default patientRouter;
