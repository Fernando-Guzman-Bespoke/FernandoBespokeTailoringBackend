import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createTestType = async (name) => {
    const sql = 'INSERT INTO tipo_examen(nombre) VALUES($1) RETURNING id_tipo_examen AS id';
    const { result, rowCount } = await query(sql, name);

    if (rowCount !== 1) throw new CustomError('Error al insertar tipo de examen.', 500);

    return result[0].id;
};

const newTest = async ({
    testTypeId, patientId, date, testResult,
}) => {
    try {
        const sql = 'INSERT INTO examen(id_paciente, fecha, resultado, id_tipo_examen) VALUES($1, $2, $3, $4) RETURNING id_examen AS id';
        const { result, rowCount } = await query(sql, patientId, date, testResult, testTypeId);

        if (rowCount !== 1) throw new CustomError('Error al insertar examen.', 500);

        return result[0].id;
    } catch (ex) {
        const { code, detail } = ex;
        if (code === '23503') {
            if (detail?.includes('(id_paciente)')) throw new CustomError(`El paciente con id ${patientId} no existe.`, 400);
            if (detail?.includes('(id_tipo_examen)')) throw new CustomError(`El tipo de examen con id ${testTypeId} no existe.`, 400);
        }

        throw ex;
    }
};

const getTestsByPatient = async ({ patientId, testType }) => {
    const sql = `SELECT E.id_examen AS id_test, TP.nombre as test_name, E.fecha as date 
    FROM tipo_examen TP 
    INNER JOIN examen E ON TP.id_tipo_examen = E.id_tipo_examen
    WHERE E.id_paciente = $1 AND TP.nombre ILIKE $2`;

    const { result, rowCount } = await query(sql, patientId, `%${testType ?? ''}%`);

    if (rowCount === 0) throw new CustomError('No se encontraron examenes para el paciente.', 404);

    return result;
};

const getTestTypes = async () => {
    const sql = 'SELECT id_tipo_examen as id, nombre as name FROM tipo_examen';

    const { result, rowCount } = await query(sql);

    if (rowCount === 0) throw new CustomError('No se encontraron examenes para el paciente.', 404);

    return result;
};

const getTestData = async (testId) => {
    const sql = `SELECT TP.id_tipo_examen as test_type_id, E.fecha as date, E.resultado as result, E.id_paciente as patient_id
    FROM tipo_examen TP 
    INNER JOIN examen E ON TP.id_tipo_examen = E.id_tipo_examen
    WHERE E.id_examen = $1 LIMIT 1`;

    const { result, rowCount } = await query(sql, testId);

    if (rowCount === 0) throw new CustomError('No se encontró el examen.', 404);

    return result[0];
};

const updateTest = async ({
    testId, testTypeId, testResult,
}) => {
    try {
        const sql = 'UPDATE examen SET id_tipo_examen = $1, resultado = $2  WHERE id_examen = $3';
        const { rowCount } = await query(sql, testTypeId, testResult, testId);

        if (rowCount !== 1) throw new CustomError('Error al actualizar examen.', 500);
    } catch (ex) {
        const { code, detail } = ex;
        if (code === '23503') {
            if (detail?.includes('(id_tipo_examen)')) throw new CustomError(`El tipo de examen con id ${testTypeId} no existe.`, 400);
        }

        throw ex;
    }
};

export {
    createTestType, newTest, getTestsByPatient, getTestTypes, getTestData, updateTest,
};
