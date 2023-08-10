import CustomError from '../../helpers/customError.js';
import {
    doctorsWithMorePatients,
    medicalCenterWithMorePatients,
    mostDeadlyDiseases,
    patientsWithMoreVisits,
} from './report.model.js';

const getmostDeadlyDiseasesController = async (req, res) => {
    try {
        const result = await mostDeadlyDiseases();

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
const getDoctorsWithMorePatientsController = async (req, res) => {
    try {
        const result = await doctorsWithMorePatients();

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
const getPatientsWithMoreVisitsController = async (req, res) => {
    try {
        const result = await patientsWithMoreVisits();

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
const getMedicalCenterWithMorePatientsController = async (req, res) => {
    try {
        const result = await medicalCenterWithMorePatients();

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
    getmostDeadlyDiseasesController,
    getDoctorsWithMorePatientsController,
    getPatientsWithMoreVisitsController,
    getMedicalCenterWithMorePatientsController,
};
