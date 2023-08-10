import express from 'express';
import newProcedureSchema from '../../helpers/validationSchemas/newProcedureSchema.js';
import validateBody from '../../middleware/validateBody.js';
import newConsultationSchema from '../../helpers/validationSchemas/newConsultationSchema.js';
import newSurgerySchema from '../../helpers/validationSchemas/newSurgerySchema.js';
import { ensureDoctorAuth } from '../../middleware/ensureAuth.js';
import {
    getDiagnosticsByPatientController,
    getProcedureDataController,
    getProceduresPreliminaryDataController,
    newConsultationController,
    newSurgeryController,
} from './procedure.controller.js';

const procedureRouter = express.Router();

procedureRouter.post(
    '/newConsultation',
    ensureDoctorAuth,
    validateBody(newProcedureSchema),
    validateBody(newConsultationSchema),
    newConsultationController,
);
procedureRouter.post(
    '/newSurgery',
    ensureDoctorAuth,
    validateBody(newProcedureSchema),
    validateBody(newSurgerySchema),
    newSurgeryController,
);
procedureRouter.get(
    '/preliminaryData/:patientId',
    ensureDoctorAuth,
    getProceduresPreliminaryDataController,
);
procedureRouter.get('/diagnosticsByPatient', ensureDoctorAuth, getDiagnosticsByPatientController);
procedureRouter.get('/:procedureId', ensureDoctorAuth, getProcedureDataController);

export default procedureRouter;
