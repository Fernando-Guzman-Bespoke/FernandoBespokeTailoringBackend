import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createMedicalCenter = async ({ type, name, address }) => {
    const sql = 'INSERT INTO unidad_salud (tipo, nombre, direccion) VALUES ($1, $2, $3) RETURNING id_unidad_salud as id';
    const { result, rowCount } = await query(sql, type, name, address);

    if (rowCount !== 1) throw new CustomError('Error al insertar unidad_salud.', 500);

    return result[0].id;
};

const addStockSupplies = async ({
    medicalCenterId, supplyId, quantityAvailable, maxStock,
}) => {
    try {
        const sql = 'INSERT INTO stock_suministro (id_unidad_salud, id_suministro, cantidad_disponible, stock_maximo) VALUES ($1,$2,$3,$4)';
        // eslint-disable-next-line max-len
        const { rowCount } = await query(sql, medicalCenterId, supplyId, quantityAvailable, maxStock);

        if (rowCount !== 1) throw new CustomError('Error al insertar stock de suministro.', 500);
    } catch (ex) {
        const { code, detail } = ex;
        if (code === '23503') {
            if (detail?.includes('(id_unidad_salud)')) {
                throw new CustomError(`El centro medico con id ${medicalCenterId} no existe.`, 400);
            }
            if (detail?.includes('(id_suministro)')) {
                throw new CustomError(`El tipo de suministro con id ${supplyId} no existe.`, 400);
            }
        }
        if (code === '23505') {
            if (detail?.includes('(id_suministro, id_unidad_salud)')) {
                throw new CustomError('El suministro ya fue registrado para este hospital.', 400);
            }
        }

        throw ex;
    }
};

const getMedicalCentersList = async ({ search }) => {
    let sql = 'SELECT id_unidad_salud as id, nombre AS name, tipo AS type, direccion AS address FROM unidad_salud';
    let result;
    if (search) {
        sql
      += ' WHERE nombre ILIKE $1 OR tipo ILIKE $1 OR direccion = $1';
        result = await query(sql, `%${search}%`);
    } else result = await query(sql);
    return result;
};

const getDoctorsByMedicalCenter = async (idMedicalCenter) => {
    const sql = `SELECT U.id_medico AS id, CONCAT(nombre,' ', apellido) AS name, M.especialidad AS specialization 
                FROM usuario U
                INNER JOIN contrato_laboral CL ON U.id_medico = CL.id_medico
                INNER JOIN medico M ON U.id_medico = M.id_medico
                WHERE U.id_medico IS NOT NULL AND CL.id_unidad_salud = $1
                `;

    const { result, rowCount } = await query(sql, idMedicalCenter);

    if (rowCount === 0) throw new CustomError('No se encontraron doctores.', 404);

    return result;
};

const getMedicineByMedicalCenter = async (medicalCenterId) => {
    const sql = `SELECT S.id_medicamento AS id, S.nombre AS medicine, SS.cantidad_disponible AS available 
                FROM suministro S
                INNER JOIN stock_suministro SS ON S.id_suministro = SS.id_suministro
                WHERE s.id_medicamento IS NOT NULL AND SS.id_unidad_salud = $1
                `;

    const { result, rowCount } = await query(sql, medicalCenterId);
    if (rowCount === 0) {
        throw new CustomError('No se encontraron medicinas para el centro medico.', 404);
    }

    return result;
};

const getMedicalCenterData = async (medicalCenterId) => {
    const sql = `SELECT id_unidad_salud as id, tipo AS type, nombre as name, direccion as address 
                FROM unidad_salud
                WHERE id_unidad_salud = $1
                  `;

    const { result, rowCount } = await query(sql, medicalCenterId);

    if (rowCount === 0) {
        throw new CustomError('No se encontró la unidad medica.', 404);
    }

    return result[0];
};

const getUnstockedSupplies = async (medicalCenterId) => {
    const sql = `SELECT id_suministro, nombre as name FROM suministro 
    WHERE id_suministro NOT IN ( SELECT id_suministro FROM stock_suministro WHERE id_unidad_salud = $1 );`;

    const { result, rowCount } = await query(sql, medicalCenterId);
    if (rowCount === 0) { throw new CustomError('No se encontraron tipos de suministro disponibles.', 404); }

    return result;
};

const getSuppliesByMedicalCenter = async (medicalCenterId, search) => {
    const sql = `SELECT S.id_suministro AS supply_id, S.nombre AS supply, SS.cantidad_disponible AS available, stock_maximo as max_stock,
                ROUND(CAST((SS.cantidad_disponible*100.0 / stock_maximo) AS NUMERIC), 2) AS percentage_available
                FROM suministro S
                INNER JOIN stock_suministro SS ON S.id_suministro = SS.id_suministro
                WHERE SS.id_unidad_salud = $1 AND S.nombre ILIKE $2
                `;

    const { result, rowCount } = await query(sql, medicalCenterId, `%${search ?? ''}%`);
    if (rowCount === 0) {
        throw new CustomError('No se encontraron suministros para el centro medico.', 404);
    }

    return result;
};

const getSupplyInStock = async (medicalCenterId, supplyId) => {
    const sql = `SELECT S.id_suministro AS supply_id, S.nombre AS supply, SS.cantidad_disponible AS available, stock_maximo as max_stock
                FROM suministro S
                INNER JOIN stock_suministro SS ON S.id_suministro = SS.id_suministro
                WHERE SS.id_unidad_salud = $1 AND S.id_suministro = $2 LIMIT 1
                `;

    const { result, rowCount } = await query(sql, medicalCenterId, supplyId);
    if (rowCount === 0) {
        throw new CustomError('No se encontraró el suministro para el centro medico.', 404);
    }

    return result[0];
};

const updateStockSupplies = async ({
    medicalCenterId, supplyId, quantityAvailable, maxStock,
}) => {
    const sql = `UPDATE stock_suministro SET  cantidad_disponible = $1, stock_maximo = $2 
                    WHERE id_unidad_salud = $3 AND id_suministro = $4`;
        // eslint-disable-next-line max-len
    const { rowCount } = await query(sql, quantityAvailable, maxStock, medicalCenterId, supplyId);

    if (rowCount !== 1) throw new CustomError('No se encontró el suministro de la unidad medica solicitada.', 500);
};

export {
    createMedicalCenter,
    addStockSupplies,
    getMedicalCentersList,
    getDoctorsByMedicalCenter,
    getMedicineByMedicalCenter,
    getMedicalCenterData,
    getUnstockedSupplies,
    getSuppliesByMedicalCenter,
    updateStockSupplies,
    getSupplyInStock,
};
