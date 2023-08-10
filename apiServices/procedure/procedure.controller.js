/* eslint-disable camelcase */
import CustomError from '../../helpers/customError.js';
import { getMedicineByProcedure } from '../supply/supply.model.js';
import {
    addInvolvedDoctor,
    addPatientEvolution,
    addPrescriptions,
    getDiagnosticsByPatient,
    getDiagnosticsByProcedure,
    getDoctorsByProcedure,
    getProcedureGeneralData,
    getProceduresPreliminaryData,
    getSurgeryDescription,
    newConsultationProcedure,
    newDiagnostic,
    newProcedure,
    newSurgeryProcedure,
} from './procedure.model.js';

const newConsultationController = async (req, res) => {
    const {
        patientId,
        prescriptions: prescriptionsList,
        doctors: doctorsList,
        diagnostics: diagnosticsList,
        patientEvolution,
        patientDead,
        medicalCenterId,
    } = req.body;

    try {
        const consultationId = await newConsultationProcedure();
        const procedureId = await newProcedure({
            patientId,
            date: new Date(),
            consultationId,
            medicalCenterId,
        });
        await addPatientEvolution({ patientEvolution, isDead: patientDead, procedureId });

        // agregar enfermedades diagnosticadas
        if (Array.isArray(diagnosticsList)) {
            const promises = [];
            diagnosticsList.forEach((diagnostic) => {
                const { disease, symptoms } = diagnostic;
                promises.push(newDiagnostic({ consultationId, disease, description: symptoms }));
            });
            await Promise.all(promises);
        }

        // agregar doctores involucrados
        if (Array.isArray(doctorsList)) {
            const promises = [];
            doctorsList.forEach((doctorId) => {
                promises.push(addInvolvedDoctor({ procedureId, doctorId }));
            });
            await Promise.all(promises);
        }

        // agregar medicamentos recetados
        if (Array.isArray(prescriptionsList)) {
            const promises = [];
            prescriptionsList.forEach((prescription) => {
                const { medicineId, dose } = prescription;
                promises.push(addPrescriptions({ procedureId, medicineId, dose }));
            });
            await Promise.all(promises);
        }

        res.send({ id: procedureId });
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

const newSurgeryController = async (req, res) => {
    const {
        patientId,
        prescriptions: prescriptionsList,
        doctors: doctorsList,
        patientEvolution,
        patientDead,
        medicalCenterId,
        description,
    } = req.body;

    try {
        const surgeryId = await newSurgeryProcedure(description);
        const procedureId = await newProcedure({
            patientId,
            date: new Date(),
            surgeryId,
            medicalCenterId,
        });
        await addPatientEvolution({ patientEvolution, isDead: patientDead, procedureId });

        // agregar doctores involucrados
        if (Array.isArray(doctorsList)) {
            const promises = [];
            doctorsList.forEach((doctorId) => {
                promises.push(addInvolvedDoctor({ procedureId, doctorId }));
            });
            await Promise.all(promises);
        }

        // agregar medicamentos recetados
        if (Array.isArray(prescriptionsList)) {
            const promises = [];
            prescriptionsList.forEach((prescription) => {
                const { medicineId, dose } = prescription;
                promises.push(addPrescriptions({ procedureId, medicineId, dose }));
            });
            await Promise.all(promises);
        }

        res.send({ id: procedureId });
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

const getProceduresPreliminaryDataController = async (req, res) => {
    const { patientId } = req.params;

    try {
        const result = await getProceduresPreliminaryData(patientId);
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

const getDiagnosticsByPatientController = async (req, res) => {
    const { patientId, disease } = req.query;

    try {
        if (!patientId) {
            throw new CustomError("No se especificó el id del paciente en param 'patientId'.", 400);
        }

        const result = await getDiagnosticsByPatient({ patientId, disease });

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

const getProcedureDataController = async (req, res) => {
    const { procedureId } = req.params;

    try {
        let result = {};
        const {
            id, medical_center_id, date, patient_evolution, patient_dead, id_cirugia,
        } = await getProcedureGeneralData(procedureId);

        result = {
            procedureId: id,
            medicalCenterId: medical_center_id,
            date,
            patientEvolution: patient_evolution,
            patientDead: patient_dead,
            type: id_cirugia ? 'surgery' : 'consultation',
        };

        // obtener descripcion de cirugia
        if (id_cirugia) {
            try {
                const { description } = await getSurgeryDescription(id_cirugia);
                result = { ...result, description };
            } catch (ex) {
                // empty
            }
        }

        // obtener recetas

        try {
            const prescriptions = await getMedicineByProcedure(procedureId);
            result = {
                ...result,
                prescriptions: prescriptions.map((row) => ({
                    medicine: row.medicine_id,
                    dose: row.dose,
                })),
            };
            // eslint-disable-next-line no-empty
        } catch (ex) {}

        // obtener diagnosticos
        try {
            const diagnostics = await getDiagnosticsByProcedure(procedureId);
            result = { ...result, diagnostics };
            // eslint-disable-next-line no-empty
        } catch (ex) {}

        // obtener doctores
        try {
            const doctors = await getDoctorsByProcedure(procedureId);
            result = {
                ...result,
                doctors: Array.from(new Set(doctors.map((val) => val.doctor_id))),
            };
            // eslint-disable-next-line no-empty
        } catch (ex) {}

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
    newConsultationController,
    getProceduresPreliminaryDataController,
    getDiagnosticsByPatientController,
    newSurgeryController,
    getProcedureDataController,
};
