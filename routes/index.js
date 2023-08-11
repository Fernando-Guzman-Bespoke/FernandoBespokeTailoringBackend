import express from 'express';
import generalRouter from '../apiServices/general/general.route.js';
import userRouter from '../apiServices/user/user.route.js';
import patientRouter from '../apiServices/patient/patient.route.js';
import procedureRouter from '../apiServices/procedure/procedure.route.js';
import medicalCenterRouter from '../apiServices/medicalCenter/medicalCenter.route.js';
import supplyRouter from '../apiServices/supply/supplyRouter.js';
import testRouter from '../apiServices/test/test.router.js';
import reportRouter from '../apiServices/report/report.router.js';
import orderRouter from '../apiServices/order/order.route.js';
import measureRouter from '../apiServices/measures/measure.route.js';

const router = express.Router();

// router.use('/', generalRouter);
router.use('/user', userRouter);
router.use('/patient', patientRouter);
router.use('/procedure', procedureRouter);
router.use('/medicalCenter', medicalCenterRouter);
router.use('/supply', supplyRouter);
router.use('/test', testRouter);
router.use('/report', reportRouter);
router.use('/order', orderRouter);
router.use('/measure', measureRouter);
export default router;
