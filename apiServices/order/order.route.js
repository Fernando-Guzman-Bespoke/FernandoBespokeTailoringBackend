import express from 'express';
import loginSchema from '../../helpers/validationSchemas/loginSchema.js';
import newDoctorSchema from '../../helpers/validationSchemas/newDoctorSchema.js';
import newUserSchema from '../../helpers/validationSchemas/newUserSchema.js';
import validateBody from '../../middleware/validateBody.js';
import {
    createPedidoController,
} from './order.controller.js';

const router = express.Router();

router.post('/createPedido', createPedidoController);


export default router;
