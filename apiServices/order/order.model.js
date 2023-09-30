import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const createPedido = async (data) => {
    console.log(data)
    console.log(Object.values(data).length);  // Debería imprimir 32 si tienes 32 marcadores de posición.
    try {
        const resPedidoInsert = await query(
            `INSERT INTO public.pedidos(
                cliente_id, fecha, fecha_entrega, tela_cuerpo_id, hilo_cuerpo_id, boton_cuerpo_id, etiqueta_cuerpo_id, tela_combinacion_id, 
                ojales_combinacion_id, hilo_boton_combinacion_id, entretela_combinacion_id, iniciales, boton_en_cuello, boton_lateral, 
                mancuerna_doble, bolsa, costura_p_pluma, combinacion, plaquet, cuello, collar_interno, collar_externo, botonera, bies_de_botonera, 
                orilla_de_plaquet, puno_interno, puno_externo, flecha, botonera_flecha, trabita_de_manga, coderas, notas
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, 
                $25, $26, $27, $28, $29, $30, $31, $32
            ) RETURNING id`,
            ...Object.values(data)
        );
        console.log(data)
        console.log(resPedidoInsert)
        console.log(resPedidoInsert.rowCount)

        if (resPedidoInsert.rowCount !== 1) {
            throw new CustomError('No se pudo registrar el pedido.', 500);
        }

        return resPedidoInsert.result[0].id;
    } catch (err) {
        if (err instanceof CustomError) throw err;
        const { code, detail } = err;
        console.log(code)
        console.log(err)
        let error = 'Datos no válidos.';

        throw new CustomError(detail, 400);
    }
};

export {
    createPedido,
};