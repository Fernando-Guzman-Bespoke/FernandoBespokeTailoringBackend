import express from 'express';
import validateBody from '../../middleware/validateBody.js';
import {
    getClientesController,
} from './client.controller.js';

const router = express.Router();

router.get('/clientes', getClientesController);


export default router;
