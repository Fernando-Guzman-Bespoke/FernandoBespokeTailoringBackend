import CustomError from '../../helpers/customError.js';
import {
    createTestType, getTestData, getTestTypes, getTestsByPatient, newTest, updateTest,
} from './test.model.js';

const createTestTypeController = async (req, res) => {
    const { name } = req.body;

    try {
        const testTypeId = await createTestType(name);
        res.send({ id: testTypeId });
    } catch (ex) {
        res.status(500).send({ err: 'Ocurrió un error al insertar tipo de examen.', status: 500 });
    }
};

const createTestController = async (req, res) => {
    const {
        patientId, testTypeId, testResult,
    } = req.body;

    try {
        const testId = await newTest({
            testTypeId,
            patientId,
            date: new Date(),
            testResult,
        });

        res.send({ id: testId });
    } catch (ex) {
        let err = 'Ocurrió un error al realizar nuevo examen.';
        let status = 500;

        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status;
        }
        res.statusMessage = err;
        res.status(status).send({ err, status });
    }
};

const updateTestController = async (req, res) => {
    const {
        testId, testTypeId, testResult,
    } = req.body;

    try {
        await updateTest({
            testTypeId,
            testResult,
            testId,
        });

        res.sendStatus(200);
    } catch (ex) {
        let err = 'Ocurrió un error al actualizar examen.';
        let status = 500;

        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status;
        }
        res.statusMessage = err;
        res.status(status).send({ err, status });
    }
};

const getTestsByPatientController = async (req, res) => {
    const { patientId, testType } = req.query;

    try {
        if (!patientId) { throw new CustomError("No se especificó el id del paciente en param 'patientId'.", 400); }

        const result = await getTestsByPatient({ patientId, testType });

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

const getTestTypesController = async (req, res) => {
    try {
        const result = await getTestTypes();

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

const getTestDataController = async (req, res) => {
    const { testId } = req.params;

    try {
        const result = await getTestData(testId);
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

export {
    createTestTypeController,
    createTestController,
    getTestsByPatientController,
    getTestTypesController,
    getTestDataController,
    updateTestController,
};
