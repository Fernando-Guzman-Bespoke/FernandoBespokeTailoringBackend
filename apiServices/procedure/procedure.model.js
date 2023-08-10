import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const newProcedure = async ({
    patientId, date, consultationId = null, surgeryId = null, medicalCenterId,
}) => {
    try {
        const procedureQuery = 'INSERT INTO procedimiento (fecha, id_consulta, id_cirugia, id_paciente, id_unidad_salud) VALUES ($1, $2, $3, $4, $5) RETURNING id_procedimiento AS id';
        const { result: procedureQueryResult, rowCount: procedureQueryRowCount } = await query(
            procedureQuery,
            date,
            consultationId,
            surgeryId,
            patientId,
            medicalCenterId,
        );

        if (procedureQueryRowCount !== 1) {
            throw new CustomError('Error al insertar datos de procedimiento.', 500);
        }

        return procedureQueryResult[0].id;
    } catch (ex) {
        const { code, detail } = ex;
        if (code !== '23503' || !detail?.includes('(id_unidad_salud)')) throw ex;
        throw new CustomError(`La unidad de salud con id ${medicalCenterId} no existe.`, 400);
    }
};

const newDiagnostic = async ({ consultationId, disease, description }) => {
    const sql = 'INSERT INTO diagnostico (id_consulta, nombre_enfermedad, descripcion_sintomas) VALUES ($1, $2, $3)';
    const { rowCount } = await query(sql, consultationId, disease, description);

    if (rowCount !== 1) throw new CustomError('Error al insertar diagnóstico.', 500);
};

const addInvolvedDoctor = async ({ procedureId, doctorId }) => {
    try {
        const sql = 'INSERT INTO medicos_procedimiento (id_medico, id_procedimiento) VALUES ($1, $2)';
        const { rowCount } = await query(sql, doctorId, procedureId);

        if (rowCount !== 1) throw new CustomError('Error al insertar doctor de un procedimiento.', 500);
    } catch (ex) {
        const { code, detail } = ex;
        if (code === '23503' && detail?.includes('(id_medico)')) {
            throw new CustomError(`El medico con id ${doctorId} no existe.`, 400);
        }
        // El médico está duplicado
        if (code === '23505' && detail?.includes('(id_medico, id_procedimiento)')) return;
        throw ex;
    }
};

const newConsultationProcedure = async () => {
    // crear tabla de consulta
    const consultationQuery = 'INSERT INTO CONSULTA DEFAULT VALUES RETURNING id_consulta AS id';
    const { result, rowCount } = await query(consultationQuery);
    if (rowCount !== 1) throw new CustomError('Error al insertar datos de consulta.', 500);

    return result[0].id;
};

const newSurgeryProcedure = async (description) => {
    // crear tabla de consulta
    const consultationQuery = 'INSERT INTO cirugia (descripcion) VALUES ($1) RETURNING id_cirugia AS id';
    const { result, rowCount } = await query(consultationQuery, description);
    if (rowCount !== 1) throw new CustomError('Error al insertar datos de cirugia.', 500);

    return result[0].id;
};

const addPatientEvolution = async ({ patientEvolution, isDead, procedureId }) => {
    const evolutionQuery = 'INSERT INTO evolucion_paciente (estado, fallecido, id_procedimiento) VALUES ($1, $2, $3)';
    const { rowCount: evolutionQueryRowCount } = await query(
        evolutionQuery,
        patientEvolution,
        isDead ?? false,
        procedureId,
    );
    if (evolutionQueryRowCount !== 1) {
        throw new CustomError('Error al insertar datos de evolucion pacientes.', 500);
    }
};

const addPrescriptions = async ({ procedureId, medicineId, dose }) => {
    try {
        const sql = 'INSERT INTO medicamento_suministrado (id_medicamento, id_procedimiento, dosis) VALUES ($1, $2, $3)';
        const { rowCount } = await query(sql, medicineId, procedureId, dose);

        if (rowCount !== 1) {
            throw new CustomError('Error al insertar recetas de un procedimiento.', 500);
        }
    } catch (ex) {
        const { code, detail } = ex;
        if (code !== '23503' || !detail?.includes('(id_medicamento)')) throw ex;
        throw new CustomError(`La medicina con el id ${medicineId} no existe.`, 400);
    }
};

const getProceduresPreliminaryData = async (patientId) => {
    const sql = `SELECT P.id_procedimiento as idprocedimiento, id_consulta as idconsulta, id_cirugia as idcirugia, fecha as date, CONCAT(nombre, ' ', apellido) AS doctor  FROM procedimiento P
    INNER JOIN medicos_procedimiento MP ON P.id_procedimiento = MP.id_procedimiento
    INNER JOIN medico M ON M.id_medico = MP.id_medico
    INNER JOIN usuario U ON M.id_medico = U.id_medico
    WHERE id_paciente = $1 ORDER BY fecha DESC`;

    const { result, rowCount } = await query(sql, patientId);

    if (rowCount === 0) { throw new CustomError('No se encontraron resultados de procedimientos para el paciente.', 404); }

    // parsear resultados a formato {id, type, date, doctors}
    const parsedResult = {};
    result.forEach((row) => {
        const {
            idconsulta, idprocedimiento, date, doctor,
        } = row;
        const id = idprocedimiento;
        const type = idconsulta ? 'consulta' : 'cirugía';
        const hash = id + type;

        // agregar solo una vez el id, tipo y fecha
        if (!parsedResult[hash]) {
            parsedResult[hash] = {
                id, date, type, doctors: [doctor],
            };
        } else parsedResult[hash].doctors.push(doctor);
    });

    return Object.values(parsedResult);
};

const getDiagnosticsByPatient = async ({ patientId, disease }) => {
    const sql = `SELECT D.nombre_enfermedad AS disease, P.fecha AS date, D.descripcion_sintomas AS symptoms FROM diagnostico D
                INNER JOIN procedimiento P ON P.id_consulta = D.id_consulta
                WHERE P.id_paciente = $1 AND 
                (D.nombre_enfermedad ILIKE $2 OR D.descripcion_sintomas ILIKE $2)`;

    const { result, rowCount } = await query(sql, patientId, `%${disease ?? ''}%`);

    if (rowCount === 0) throw new CustomError('No se encontraron diagnósticos para el paciente.', 404);

    return result;
};

const getDiagnosticsByProcedure = async (procedureId) => {
    const sql = `SELECT D.nombre_enfermedad AS disease, P.fecha AS date, D.descripcion_sintomas AS symptoms FROM diagnostico D
                INNER JOIN procedimiento P ON P.id_consulta = D.id_consulta
                WHERE P.id_procedimiento = $1`;

    const { result, rowCount } = await query(sql, procedureId);

    if (rowCount === 0) throw new CustomError('No se encontraron diagnósticos para el procedimiento.', 404);

    return result;
};

const getDoctorsByProcedure = async (procedureId) => {
    const sql = `SELECT U.id_medico as doctor_id, CONCAT(U.nombre, ' ', U.apellido) AS name, M.especialidad AS specialization
                FROM usuario U
                INNER JOIN medicos_procedimiento MP ON MP.id_medico = U.id_medico
                INNER JOIN medico M ON M.id_medico = U.id_medico
                WHERE MP.id_procedimiento = $1`;

    const { result, rowCount } = await query(sql, procedureId);

    if (rowCount === 0) throw new CustomError('No se encontraron medicos para el procedimiento.', 404);

    return result;
};

const getProcedureGeneralData = async (procedureId) => {
    const sql = `SELECT P.id_procedimiento AS id, P.id_unidad_salud as medical_center_id,
                    fecha AS date, EP.estado AS patient_evolution, EP.fallecido AS patient_dead,
                    id_consulta, id_cirugia
                FROM  procedimiento P
                INNER JOIN evolucion_paciente EP ON P.id_procedimiento = EP.id_procedimiento
                WHERE P.id_procedimiento = $1 LIMIT 1`;

    const { result, rowCount } = await query(sql, procedureId);

    if (rowCount === 0) throw new CustomError('No se encontraron los datos del procedimiento.', 404);

    return result[0];
};

const getSurgeryDescription = async (surgeryId) => {
    const sql = 'SELECT descripcion AS description FROM cirugia WHERE id_cirugia = $1';

    const { result, rowCount } = await query(sql, surgeryId);

    if (rowCount === 0) throw new CustomError('No se encontró la cirugía.', 404);

    return result[0];
};

export {
    newProcedure,
    newConsultationProcedure,
    newDiagnostic,
    addInvolvedDoctor,
    addPatientEvolution,
    addPrescriptions,
    getProceduresPreliminaryData,
    getDiagnosticsByPatient,
    newSurgeryProcedure,
    getDiagnosticsByProcedure,
    getDoctorsByProcedure,
    getProcedureGeneralData,
    getSurgeryDescription,
};
