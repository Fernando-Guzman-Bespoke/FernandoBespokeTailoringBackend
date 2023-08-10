import moment from 'moment';
import { getPatientData, getPatients, newPatient } from './patient.model.js';

const newPatientController = async (req, res) => {
    try {
        const {
            name, lastName, cui, passport, email, birthday, sex, weight, height,
        } = req.body;
        const parsedBirthday = moment(new Date(birthday)).format('YYYY/MM/DD');
        const patientId = await newPatient({
            name,
            lastName,
            cui,
            passport,
            email,
            birthday: parsedBirthday,
            sex: sex?.toUpperCase(),
            weight,
            height,
        });
        res.status(200).send({ id: patientId });
    } catch (ex) {
        const message = ex?.message ?? 'Ocurrió un error en el servidor.';
        const status = ex?.status ?? 500;
        res.statusMessage = message;
        res.status(status).send({ err: message, status });
    }
};

const getPatientsController = async (req, res) => {
    const { search } = req.query;
    try {
        const { result, rowCount } = await getPatients({ search });

        if (rowCount === 0) return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 });
        return res.send(result);
    } catch (ex) {
        res.statusMessage = 'Ocurrió un error.';
        return res.status(500).send({ err: 'Ocurrió un error.', status: 500 });
    }
};

const getPatientDataController = async (req, res) => {
    const { patientId } = req.params;

    try {
        const { result, rowCount } = await getPatientData(patientId);
        if (rowCount === 0) return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 });
        return res.send(result[0]);
    } catch (ex) {
        res.statusMessage = 'Ocurrió un error.';
        return res.status(500).send({ err: 'Ocurrió un error.', status: 500 });
    }
};

// eslint-disable-next-line import/prefer-default-export
export { newPatientController, getPatientsController, getPatientDataController };
