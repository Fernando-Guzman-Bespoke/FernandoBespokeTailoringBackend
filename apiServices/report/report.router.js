import express from 'express';
import { ensureAdminAuth } from '../../middleware/ensureAuth.js';
import {
    getDoctorsWithMorePatientsController,
    getMedicalCenterWithMorePatientsController,
    getPatientsWithMoreVisitsController,
    getmostDeadlyDiseasesController,
} from './report.controller.js';

const reportRouter = express.Router();

reportRouter.get('/mostDeadlyDiseases', ensureAdminAuth, getmostDeadlyDiseasesController);
reportRouter.get('/doctorsWithMorePatients', ensureAdminAuth, getDoctorsWithMorePatientsController);
reportRouter.get('/patientsWithMoreVisits', ensureAdminAuth, getPatientsWithMoreVisitsController);
reportRouter.get(
    '/medicalCenterWithMorePatients',
    ensureAdminAuth,
    getMedicalCenterWithMorePatientsController,
);

export default reportRouter;
