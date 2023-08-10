import yup from 'yup';

export default yup
    .object()
    .shape({
        password: yup.string().required("El campo 'password' es obligatorio."),
        sex: yup
            .string().matches(/^[MF]$/, "El campo 'sex' debe ser 'M' o 'F'.").required("El campo 'sex' es obligatorio."),
        email: yup
            .string()
            .nullable()
            .email("El valor de 'email' es inválido.")
            .required("El campo 'email' es obligatorio."),
        lastName: yup.string().required("El campo 'lastName' es obligatorio."),
        name: yup.string().required("El campo 'name' es obligatorio."),
        cui: yup
            .number()
            .nullable()
            .when('passport', {
                is: (val) => !val,
                then: () => yup
                    .number()
                    .integer("El campo 'cui' debe ser un número entero.")
                    .typeError("El campo 'cui' debe ser un número.")
                    .test(
                        'len',
                        "El campo 'cui' debe tener una longitud de 13 caracteres.",
                        (val) => val.toString().length === 13,
                    )
                    .required(
                        "Debe proporcionar el campo un número de identificación 'cui' o 'passport'",
                    ),
                otherwise: () => yup.number(),
            }),

    })
    .test(
        'exclusivity',
        "Solo se permite un número de identificación 'cui' o 'passport'",
        (value) => {
            const { cui, passport } = value || {};
            return !(cui && passport);
        },
    );
