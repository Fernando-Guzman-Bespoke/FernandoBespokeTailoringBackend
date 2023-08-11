import sha256 from 'js-sha256';
import CustomError from '../../helpers/customError.js';
import {
    createPedido,
} from './order.model.js';
const createPedidoController = async (req, res) => {
    const {
        id_cliente, fecha_pedido, fecha_entrega, id_tela_cuerpo, id_hilo_cuerpo, id_boton, iniciales, entretela, cuello, boton_cuello, boton_lateral, puno, costura_pluma, plaquet, id_combinacion, notas
    } = req.body;
    // console.log(req.body)
    try {
        const pedidoId = await createPedido({
            id_cliente, fecha_pedido, fecha_entrega, id_tela_cuerpo, id_hilo_cuerpo, id_boton, iniciales, entretela, cuello, boton_cuello, boton_lateral, puno, costura_pluma, plaquet, id_combinacion, notas
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
