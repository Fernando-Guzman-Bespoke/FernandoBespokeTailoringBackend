import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createPedido = async ({
    id_cliente, fecha_pedido, fecha_entrega, id_tela_cuerpo, id_hilo_cuerpo, id_boton, iniciales, entretela, cuello, boton_cuello, boton_lateral, puno, costura_pluma, plaquet, id_combinacion, notas
}) => {
    try {
        const resPedidoInsert = await query(
            'INSERT INTO public.pedido(id_cliente, fecha_pedido, fecha_entrega, id_tela_cuerpo, id_hilo_cuerpo, id_boton, iniciales, entretela, cuello, boton_cuello, boton_lateral, puno, costura_pluma, plaquet, id_combinacion, notas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_pedido as id',
            id_cliente, fecha_pedido, fecha_entrega, id_tela_cuerpo, id_hilo_cuerpo, id_boton, iniciales, entretela, cuello, boton_cuello, boton_lateral, puno, costura_pluma, plaquet, id_combinacion, notas
        );

        if (resPedidoInsert.rowCount !== 1) { 
            throw new CustomError('No se pudo registrar el pedido.', 500); 
        }

        return resPedidoInsert.result[0].id;
    } catch (err) {
        if (err instanceof CustomError) throw err;
        const { code, detail } = err;
        let error = 'Datos no válidos.';

        throw new CustomError(error, 400);
    }
};


export {
    createPedido,
};