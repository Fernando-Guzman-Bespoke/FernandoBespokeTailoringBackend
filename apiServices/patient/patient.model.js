import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const newPatient = async ({
    name,
    lastName,
    cui,
    passport,
    email,
    birthday,
    sex,
    weight,
    height,
}) => {
    try {
        const querySql = 'INSERT INTO paciente (cui, pasaporte, nombres, apellidos, email, peso, altura, sexo, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_paciente AS id';
        const { result, rowCount } = await query(
            querySql,
            cui,
            passport,
            name,
            lastName,
            email,
            weight,
            height,
            sex,
            birthday,
        );

        if (rowCount !== 1) throw new CustomError('No se pudo registrar al paciente.', 500);
        return result[0].id;
    } catch (err) {
        if (err instanceof CustomError) throw err;

        const { code, detail } = err;
        let error = 'Datos no válidos.';
        if (code === '23505') {
            if (detail?.includes('(cui)')) error = 'El cui ya se encuentra asignado a otro paciente.';
            if (detail?.includes('(pasaporte)')) {
                error = 'El pasaporte ya se encuentra asignado a otro paciente.';
            }
        }
        throw new CustomError(error, 400);
    }
};

const getPatients = async ({ search }) => {
    let sql = 'SELECT * FROM paciente';
    let result;
    if (search) {
        sql
      += ' WHERE nombres ILIKE $1 OR apellidos ILIKE $1 OR cui = $2 OR pasaporte = $2 OR email = $2';
        result = await query(sql, `%${search}%`, search);
    } else result = await query(sql);

    return result;
};

const getPatientData = async (patientId) => {
    const sql = `SELECT cui, pasaporte as passport, nombres AS name, apellidos AS lastName, email,
     peso AS weight, altura as Height, sexo AS sex, fecha_nacimiento AS birthday
      FROM paciente WHERE id_paciente = $1`;

    const result = await query(sql, patientId);
    return result;
};

export { newPatient, getPatients, getPatientData };
