import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createUser = async ({
    cui,
    passport,
    name,
    lastName,
    email,
    sex,
    passwordHash,
    doctorId,
    adminId,
}) => {
    try {
        const resUserInsert = await query(
            'INSERT INTO usuario(cui, pasaporte, nombre, apellido, email, sexo, password, id_medico, id_administrador) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_usuario as id',
            cui,
            passport,
            name,
            lastName,
            email,
            sex,
            passwordHash,
            doctorId,
            adminId,
        );

        if (resUserInsert.rowCount !== 1) { throw new CustomError('No se pudo registrar el usuario.', 500); }

        return resUserInsert.result[0].id;
    } catch (err) {
        if (err instanceof CustomError) throw err;
        const { code, detail } = err;
        let error = 'Datos no válidos.';
        // LLave repetida
        if (code === '23505') {
            if (detail?.includes('(cui)')) error = 'El cui ya se encuentra asignado a otro usuario.';
            if (detail?.includes('(pasaporte)')) error = 'El pasaporte ya se encuentra asignado a otro usuario.';
            if (detail?.includes('(email)')) error = 'El email ya se encuentra asignado a otro usuario.';
        }

        throw new CustomError(error, 400);
    }
};

const createDoctor = async ({ speciality, medicalCenterId }) => {
    try {
    // crear registro de doctor
        const resDoctorInsert = await query(
            'INSERT INTO medico(especialidad) VALUES($1) RETURNING id_medico as id',
            speciality,
        );

        if (resDoctorInsert.rowCount !== 1) { throw new CustomError('No se pudo registrar el doctor.', 500); }

        const doctorId = resDoctorInsert.result[0].id;

        // añadir contrato laboral
        const contractQuery = 'INSERT INTO contrato_laboral (id_medico, id_unidad_salud, fecha_ingreso) VALUES ($1, $2, $3)';
        const { rowCount: contractRowCount } = await query(
            contractQuery,
            doctorId,
            medicalCenterId,
            new Date(),
        );
        if (contractRowCount !== 1) { throw new CustomError('No se pudo registrar el contrato laboral.', 500); }

        return doctorId;
    } catch (ex) {
        if (ex instanceof CustomError) throw ex;

        const { code, detail } = ex;
        if (code !== '23503' || !detail?.includes('(id_unidad_salud)')) throw ex;
        throw new CustomError(`La unidad de salud con id ${medicalCenterId} no existe.`, 400);
    }
};

const createAdmin = async () => {
    const { result, rowCount } = await query(
        'INSERT INTO administrador DEFAULT VALUES RETURNING id_administrador as id',
    );

    if (rowCount !== 1) { throw new CustomError('No se pudo registrar el doctor.', 500); }

    const adminId = result[0].id;

    return adminId;
};

const authenticate = async ({ email, password }) => {
    try {
        const userData = await query(
            'SELECT nombre, apellido, correo, adminid, employeeid, especialidad, genero FROM usuario WHERE correo = $1 AND contrasena = $2 LIMIT 1',
            email,
            password,
        );

        if (userData.rowCount !== 1) throw new CustomError('Usuario o contraseña incorrectos.', 400);

        const {
            nombre: name,
            apellido: lastName,
            genero: sex,
            adminid: adminid,
            employeeid: employeeid,
        } = userData.result[0];

        console.log(userData.result[0])

        return {
            name,
            lastName,
            sex,
            isAdmin: adminid !== null,
            isEmployee: employeeid !== null,
        };
    } catch (ex) {
        if (ex instanceof CustomError) throw ex;
        throw new CustomError('Error al conectar con la base de datos.', 500);
    }
};

const getUsersList = async () => {
    const sql = `SELECT id_usuario as user_id, cui, pasaporte AS passport, CONCAT(nombre, ' ', apellido) AS name,
                email, sexo AS sex, id_medico AS doctor_id, id_administrador AS admin_id 
                FROM usuario`;

    const { result, rowCount } = await query(sql);

    if (rowCount === 0) throw new CustomError('No se encontraron usuarios.', 404);

    const parsedResult = result.map((row) => {
        const data = row;
        if (!data.cui) delete data.cui;
        if (!data.passport) delete data.passport;
        if (!data.doctor_id) delete data.doctor_id;
        if (!data.admin_id) delete data.admin_id;
        return row;
    });

    return parsedResult;
};

const getDoctors = async ({ search }) => {
    let sql = `SELECT u.nombre AS name, u.apellido AS lastname, u.cui, u.pasaporte AS passport, 
            me.especialidad AS specialty, sexo as sex FROM usuario u 
            INNER JOIN medico me ON u.id_medico = me.id_medico `;
    let result;
    if (search) {
        sql
      += ' WHERE u.nombre ILIKE $1 OR u.apellido ILIKE $1 OR cui = $2 OR pasaporte = $2';
        result = await query(sql, `%${search}%`, search);
    } else result = await query(sql);

    return result;
};

const getUserData = async (userId) => {
    const sql = `SELECT u.id_usuario as user_id, u.cui, u.pasaporte AS passport, u.nombre, u.apellido, 
    CONCAT(u.nombre, ' ', u.apellido) AS name, u.email, u.sexo AS sex, u.id_medico AS doctor_id, u.id_administrador AS admin_id,
    u.password, cl.id_unidad_salud as medicalcenter, m.especialidad as speciality
    FROM usuario u LEFT JOIN medico m on m.id_medico = u.id_medico LEFT JOIN contrato_laboral cl 
        on cl.id_medico = m.id_medico WHERE U.id_usuario = $1`;
    const result = await query(sql, userId);
    return result;
};

// eslint-disable-next-line max-len, camelcase
const updateUser = async (userId, name, lastName, cui, passport, email, sex, password, speciality, medicalcenterid, admin_id, doctor_id) => {
    try {
        const sql = `UPDATE usuario
        SET nombre = $2,
            apellido =$3,
            cui = $4,
            pasaporte = $5,
            email = $6,
            sexo = $7,
            password = $8
        WHERE id_usuario = $1`;
        const cleanedCui = cui === undefined ? null : cui;
        const cleanedPassport = passport === undefined ? null : passport;
        // eslint-disable-next-line max-len
        // console.log(userId, name, lastName, cleanedCui, cleanedPassport, email, sex, password, speciality, medicalcenterid);
        // eslint-disable-next-line max-len
        const { rowCount } = await query(sql, userId, name, lastName, cleanedCui, cleanedPassport, email, sex, password);
        if (rowCount !== 1) throw new CustomError('Error al actualizar usuario.', 500);
        // Si es médico, actualiza también la información del médico
        // eslint-disable-next-line camelcase
        if (doctor_id) {
            const queryDoctor = `
            UPDATE medico
            SET especialidad = $2
            WHERE id_medico = $1;
            `;
            await query(queryDoctor, doctor_id, speciality);

            const queryContract = `
            UPDATE contrato_laboral
            SET id_unidad_salud = $2
            WHERE id_medico = $1;
            `;
            await query(queryContract, doctor_id, medicalcenterid);
        }
    } catch (ex) {
        const { code, detail } = ex;
        if (code === '23503') {
            if (detail?.includes('(userId)')) throw new CustomError(`El usuario con id ${userId} no existe.`, 400);
        }
        throw ex;
    }
};

export {
    createUser, createDoctor, authenticate, createAdmin, getUsersList, getDoctors, getUserData,
    updateUser,
};
