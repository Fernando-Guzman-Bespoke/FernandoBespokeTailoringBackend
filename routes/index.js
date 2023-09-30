import express from 'express';
import generalRouter from '../apiServices/general/general.route.js';
import userRouter from '../apiServices/user/user.route.js';
import orderRouter from '../apiServices/order/order.route.js';
import testRouter from '../apiServices/test/test.router.js';
import reportRouter from '../apiServices/report/report.router.js';
import measureRouter from '../apiServices/measures/measure.route.js';
import clientRouter from '../apiServices/client/client.route.js';

const router = express.Router();

// router.use('/', generalRouter);
router.use('/user', userRouter);
router.use('/order', testRouter);
router.use('/test', testRouter);
router.use('/report', reportRouter);
router.use('/order', orderRouter);
router.use('/measure', measureRouter);
router.use('/client', clientRouter)

export default router;
