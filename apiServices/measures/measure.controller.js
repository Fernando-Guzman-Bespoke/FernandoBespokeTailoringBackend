import sha256 from 'js-sha256';
import CustomError from '../../helpers/customError.js';
import {
    createMedida,
} from './measure.model.js';
const createMedidaController = async (req, res) => {
    const {
        id_cliente, id_medida, medida, fecha_medicion
    } = req.body;

    try {
        const medidaId = await createMedida({
            id_cliente, id_medida, medida, fecha_medicion
        });

        res.status(200).send({ id: medidaId });
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
    createMedidaController,
};
