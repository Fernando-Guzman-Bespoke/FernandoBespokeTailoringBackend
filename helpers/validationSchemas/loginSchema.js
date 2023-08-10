import yup from 'yup';

export default yup
    .object()
    .shape({

        password: yup
            .string()
            .required("El campo 'password' es obligatorio."),
        email: yup
            .string()
            .nullable()
            .email("El valor de 'email' es inválido.")
            .required("El campo 'email' no es un email válido."),
    });
