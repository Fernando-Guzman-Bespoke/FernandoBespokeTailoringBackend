import sha256 from 'js-sha256';
import CustomError from '../../helpers/customError.js';
import {
    createPedido,
} from './order.model.js';

const createPedidoController = async (req, res) => {
    const {
        cliente_id, fecha, fecha_entrega, tela_cuerpo_id, hilo_cuerpo_id, boton_cuerpo_id, etiqueta_cuerpo_id,
        tela_combinacion_id, ojales_combinacion_id, hilo_boton_combinacion_id, entretela_combinacion_id,
        iniciales, notas
    } = req.body;

    try {
        const pedidoId = await createPedido({
            cliente_id, fecha, fecha_entrega, tela_cuerpo_id, hilo_cuerpo_id, boton_cuerpo_id, etiqueta_cuerpo_id,
            tela_combinacion_id, ojales_combinacion_id, hilo_boton_combinacion_id, entretela_combinacion_id,
            iniciales,  notas
        });

        res.status(200).send({ id: pedidoId });
    } catch (ex) {
        res.statusMessage = ex?.message ?? 'Ocurrió un error.';
        if (ex instanceof CustomError) {
            return res.status(ex.status).send({ err: ex.message, status: ex.status });
        }
        res.sendStatus(500);
    }
    return null;
};

export {
    createPedidoController,
};

