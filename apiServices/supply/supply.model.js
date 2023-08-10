import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createSupply = async ({ name, idMedicine, idMiscellaneousSupply }) => {
    const sql = 'INSERT INTO suministro (nombre, id_medicamento, id_suministro_vario) VALUES ($1,$2,$3) RETURNING id_suministro AS id';

    const { result, rowCount } = await query(sql, name, idMedicine, idMiscellaneousSupply);

    if (rowCount !== 1) throw new CustomError('No se pudo insertar el suministro.', 500);

    return result[0].id;
};

const createMedicine = async () => {
    const sql = 'INSERT INTO medicamento DEFAULT VALUES RETURNING id_medicamento AS id';

    const { result, rowCount } = await query(sql);

    if (rowCount !== 1) throw new CustomError('No se pudo insertar el medicamento.', 500);

    return result[0].id;
};

const createMiscellaneousSupply = async () => {
    const sql = 'INSERT INTO suministro_vario DEFAULT VALUES RETURNING id_suministro_vario AS id';

    const { result, rowCount } = await query(sql);

    if (rowCount !== 1) throw new CustomError('No se pudo insertar el suministro vario.', 500);

    return result[0].id;
};

const getMedicineByPatient = async ({ patientId, medicineName }) => {
    const sql = `SELECT S.id_medicamento AS idmedicine, S.nombre AS medicine, MS.dosis AS dose FROM suministro S
    INNER JOIN medicamento_suministrado MS ON S.id_medicamento = MS.id_medicamento
    INNER JOIN procedimiento PR ON MS.id_procedimiento = PR.id_procedimiento
    WHERE PR.id_paciente = $1 AND S.nombre ILIKE $2
    ORDER BY PR.fecha DESC`;

    const { result, rowCount } = await query(sql, patientId, `%${medicineName ?? ''}%`);
    if (rowCount === 0) throw new CustomError('No se encontraron medicinas para el paciente.', 404);

    return result;
};

const getMedicineByProcedure = async (procedureId) => {
    const sql = `SELECT S.id_medicamento AS medicine_id, S.nombre AS medicine, MS.dosis AS dose FROM suministro S
    INNER JOIN medicamento_suministrado MS ON S.id_medicamento = MS.id_medicamento
    INNER JOIN procedimiento PR ON MS.id_procedimiento = PR.id_procedimiento
    WHERE PR.id_procedimiento = $1
    ORDER BY PR.fecha DESC`;

    const { result, rowCount } = await query(sql, procedureId);
    if (rowCount === 0) throw new CustomError('No se encontraron medicinas para procedimiento.', 404);

    return result;
};

const getSupplies = async ({ search }) => {
    let sql = `SELECT s.id_suministro AS id, s.nombre AS name, u.nombre AS medicalcenter, st.cantidad_disponible AS qtyavailable, 
                st.stock_maximo AS mxmstock FROM suministro s INNER JOIN stock_suministro st ON s.id_suministro = st.id_suministro INNER JOIN unidad_salud u
                ON u.id_unidad_salud = st.id_unidad_salud`;
    let result;
    if (search) {
        sql
      += ' WHERE s.nombre ILIKE $1 OR u.nombre ILIKE $1 OR st.cantidad_disponible = $2';
        result = await query(sql, `%${search}%`, search);
    } else result = await query(sql);
    return result;
};
const getSuppliesNearlyDepleted = async ({ search }) => {
    let sql = `select s.id_suministro as supply_id, s.nombre as supply, us.nombre as medicalCenter, 
                us.id_unidad_salud as medical_center_id, ss.cantidad_disponible as available_quantity, ss.stock_maximo as max_stok  
                from stock_suministro ss 
                inner join suministro s on ss.id_suministro = s.id_suministro
                inner join unidad_salud us on ss.id_unidad_salud = us.id_unidad_salud
                where ss.cantidad_disponible < (ss.stock_maximo*0.15) `;
    let result;
    if (search) {
        sql
      += ' AND (s.nombre ILIKE $1 OR us.nombre ILIKE $1)';
        result = await query(sql, `%${search}%`);
    } else result = await query(sql);

    return result;
};

const getSupplyData = async (supplyId) => {
    const sql = 'SELECT id_suministro AS supply_id, nombre AS name FROM suministro WHERE id_suministro = $1 LIMIT 1 ';

    const { result, rowCount } = await query(sql, supplyId);
    if (rowCount === 0) throw new CustomError('No se encontraró el suministro.', 404);

    return result[0];
};

export {
    createSupply,
    createMedicine,
    createMiscellaneousSupply,
    getMedicineByPatient,
    getMedicineByProcedure,
    getSupplies,
    getSuppliesNearlyDepleted,
    getSupplyData,
};
