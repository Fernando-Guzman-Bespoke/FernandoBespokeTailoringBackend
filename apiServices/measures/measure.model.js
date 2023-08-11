import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createMedida = async ({
    id_cliente, id_medida, medida, fecha_medicion
}) => {
    try {
        const resMedidaInsert = await query(
            'INSERT INTO public.medidas(id_cliente, id_medida, medida, fecha_medicion) VALUES ($1, $2, $3, $4) RETURNING id_medida as id',
            id_cliente, id_medida, medida, fecha_medicion
        );

        if (resMedidaInsert.rowCount !== 1) { 
            throw new CustomError('No se pudo registrar la medida.', 500); 
        }
        console.log(resMedidaInsert)
        console.log(resMedidaInsert.result[0].id)
        return resMedidaInsert.result[0].id;
    } catch (err) {
        if (err instanceof CustomError) throw err;
        const { code, detail } = err;
        let error = 'Datos no válidos.';
        console.log(code, detail)
        throw new CustomError(error, 400);
    }
};



export {
    createMedida,
};