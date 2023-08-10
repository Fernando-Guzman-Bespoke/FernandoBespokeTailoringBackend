import CustomError from '../../helpers/customError.js';
import {
    createMedicine,
    createMiscellaneousSupply,
    createSupply,
    getMedicineByPatient,
    getSupplies,
    getSuppliesNearlyDepleted,
    getSupplyData,
} from './supply.model.js';

const createMedicineController = async (req, res) => {
    try {
        const { name } = req.body;
        const idMedicine = await createMedicine();
        const supplyId = await createSupply({ name, idMedicine });

        res.send({ id: supplyId });
    } catch (ex) {
        const err = 'Ocurrió un error al crear medicina. ';
        res.statusMessage = err;
        res.status(500).send({ err, status: 500 });
    }
};

const createMiscellaneousController = async (req, res) => {
    try {
        const { name } = req.body;
        const idMiscellaneousSupply = await createMiscellaneousSupply();
        const supplyId = await createSupply({ name, idMiscellaneousSupply });

        res.send({ id: supplyId });
    } catch (ex) {
        const err = 'Ocurrió un error al crear suministro vario. ';
        res.statusMessage = err;
        res.status(500).send({ err, status: 500 });
    }
};

const getMedicineByPatientController = async (req, res) => {
    const { patientId, medicineName } = req.query;

    try {
        if (!patientId) {
            throw new CustomError("No se especificó el id del paciente en param 'patientId'.", 400);
        }

        const result = await getMedicineByPatient({ patientId, medicineName });

        res.send(result);
    } catch (ex) {
        let error = 'Ocurrió un error en el servidor';
        let status = 500;
        if (ex instanceof CustomError) {
            error = ex.message;
            status = ex.status;
        }
        res.statusMessage = error;
        res.status(status).send({ err: error, status });
    }
};

const getSuppliesController = async (req, res) => {
    const { search } = req.query;
    try {
        const { result, rowCount } = await getSupplies({ search });

        if (rowCount === 0) { return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 }); }
        return res.send(result);
    } catch (ex) {
        res.statusMessage = 'Ocurrió un error.';
        return res.status(500).send({ err: 'Ocurrió un error.', status: 500 });
    }
};

const getSuppliesNearlyDepletedController = async (req, res) => {
    const { search } = req.query;
    try {
        const { result, rowCount } = await getSuppliesNearlyDepleted({ search });

        if (rowCount === 0) { return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 }); }
        return res.send(result);
    } catch (ex) {
        res.statusMessage = 'Ocurrió un error.';
        return res.status(500).send({ err: 'Ocurrió un error.', status: 500 });
    }
};

const getSupplyDataController = async (req, res) => {
    const { supplyId } = req.params;
    try {
        const result = await getSupplyData(supplyId);
        return res.send(result);
    } catch (ex) {
        let error = 'Ocurrió un error en el servidor';
        let status = 500;
        if (ex instanceof CustomError) {
            error = ex.message;
            status = ex.status;
        }
        res.statusMessage = error;
        res.status(status).send({ err: error, status });
    }
};

// eslint-disable-next-line import/prefer-default-export
export {
    createMedicineController,
    createMiscellaneousController,
    getMedicineByPatientController,
    getSuppliesController,
    getSuppliesNearlyDepletedController,
    getSupplyDataController,
};
