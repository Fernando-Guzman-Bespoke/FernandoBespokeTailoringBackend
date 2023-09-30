import sha256 from 'js-sha256';
import CustomError from '../../helpers/customError.js';
import {
    getClientes,
} from './client.model.js';
const getClientesController = async (req, res) => {
    try {
        const clientes = await getClientes();
        res.status(200).send(clientes);
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
    getClientesController
}