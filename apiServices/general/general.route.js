import express from 'express';
import { renderIndexPage } from './general.controller.js';

const router = express.Router();

router.use('/', renderIndexPage);

export default router;
