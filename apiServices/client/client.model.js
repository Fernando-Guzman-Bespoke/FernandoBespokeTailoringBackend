import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const getClientes = async () => {
    try {
        const sql = 'SELECT id_cliente, nombre, genero FROM public.cliente';
        const { result, rowCount } = await query(sql);
        if (rowCount === 0) throw new CustomError('No se encontraron clientes.', 404);
        
        const parsedResult = result.map((row) => {
            const data = row;
            if (!data.id_cliente) delete data.id_cliente;
            if (!data.nombre) delete data.nombre;
            if (!data.genero) delete data.genero;
            return row;
        });
        return parsedResult;
    } catch (err) {
        throw new CustomError('Error al obtener los clientes.', 500);
    }
};


export {
    getClientes
}