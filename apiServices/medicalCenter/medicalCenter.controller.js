import CustomError from '../../helpers/customError.js';
import {
    addStockSupplies,
    createMedicalCenter,
    getDoctorsByMedicalCenter,
    getMedicalCenterData,
    getMedicalCentersList,
    getMedicineByMedicalCenter,
    getSuppliesByMedicalCenter,
    getSupplyInStock,
    getUnstockedSupplies,
    updateStockSupplies,
} from './medicalCenter.model.js';

const createMedicalCenterController = async (req, res) => {
    const { type, name, address } = req.body;
    try {
        const medicalCenterId = await createMedicalCenter({ type, name, address });
        return res.send({ id: medicalCenterId });
    } catch (ex) {
        let err = 'Ocurrió un error en el servidor.';
        let status = 500;
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status;
        }
        res.statusMessage = err;
        return res.status(status).send({ err, status });
    }
};

const addSuppliesToStockController = async (req, res) => {
    const {
        medicalCenterId, supplyId, quantityAvailable, maxStock,
    } = req.body;

    try {
        await addStockSupplies({
            medicalCenterId,
            supplyId,
            quantityAvailable,
            maxStock,
        });
        return res.sendStatus(200);
    } catch (ex) {
        let err = 'Ocurrió un error en el servidor.';
        let status = 500;
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status;
        }
        res.statusMessage = err;
        return res.status(status).send({ err, status });
    }
};

const updateSuppliesInStockController = async (req, res) => {
    const {
        medicalCenterId, supplyId, quantityAvailable, maxStock,
    } = req.body;

    try {
        await updateStockSupplies({
            medicalCenterId,
            supplyId,
            quantityAvailable,
            maxStock,
        });
        return res.sendStatus(200);
    } catch (ex) {
        let err = 'Ocurrió un error en el servidor.';
        let status = 500;
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status;
        }
        res.statusMessage = err;
        return res.status(status).send({ err, status });
    }
};

const getMedicalCentersListController = async (req, res) => {
    const { search } = req.query;
    try {
        const { result, rowCount } = await getMedicalCentersList({ search });
        if (rowCount === 0) return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 });
        return res.send(result);
    } catch (ex) {
        let error = 'Ocurrió un error en el servidor';
        let status = 500;
        if (ex instanceof CustomError) {
            error = ex.message;
            status = ex.status;
        }
        res.statusMessage = error;
        return res.status(status).send({ err: error, status });
    }
};

const getDoctorsByMedicalCenterController = async (req, res) => {
    const { medicalCenterId } = req.params;

    try {
        const result = await getDoctorsByMedicalCenter(medicalCenterId);

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

const getMedicineByMedicalCenterController = async (req, res) => {
    const { medicalCenterId } = req.params;

    try {
        const result = await getMedicineByMedicalCenter(medicalCenterId);

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
const getMedicalCenterDataController = async (req, res) => {
    const { medicalCenterId } = req.params;

    try {
        const result = await getMedicalCenterData(medicalCenterId);

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

const getUnstockedSuppliesController = async (req, res) => {
    const { medicalCenterId } = req.params;

    try {
        const result = await getUnstockedSupplies(medicalCenterId);

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

const getSuppliesByMedicalCenterController = async (req, res) => {
    const { medicalCenterId } = req.params;
    const { search } = req.query;

    try {
        const result = await getSuppliesByMedicalCenter(medicalCenterId, search);

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
const getSupplyInStockController = async (req, res) => {
    const { medicalCenterId, supplyId } = req.params;

    try {
        const result = await getSupplyInStock(medicalCenterId, supplyId);

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

// eslint-disable-next-line import/prefer-default-export
export {
    createMedicalCenterController,
    addSuppliesToStockController,
    getMedicalCentersListController,
    getDoctorsByMedicalCenterController,
    getMedicineByMedicalCenterController,
    getMedicalCenterDataController,
    getUnstockedSuppliesController,
    getSuppliesByMedicalCenterController,
    updateSuppliesInStockController,
    getSupplyInStockController,
};
