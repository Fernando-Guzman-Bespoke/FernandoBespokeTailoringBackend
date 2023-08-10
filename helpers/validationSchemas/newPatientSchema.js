import yup from 'yup';

export default yup
    .object()
    .shape({
        height: yup
            .number()
            .min(0.0001, "El campo 'height' debe ser mayor a cero.")
            .nullable()
            .typeError("El campo 'height' debe ser un número.")
            .required("El campo 'height' es obligatorio."),
        weight: yup
            .number()
            .min(0.0001, "El campo 'weight' debe ser mayor a cero.")
            .nullable()
            .typeError("El campo 'eight' debe ser un número.")
            .required("El campo 'weight' es obligatorio."),
        sex: yup
            .string()
            .matches(/^[MF]$/, "El campo 'sex' debe ser 'M' o 'F'.")
            .required("El campo 'sex' es obligatorio."),
        birthday: yup
            .date()
            .nullable()
            .typeError("El valor de 'birthday' no es una fecha válida.")
            .required("El campo 'birthday' es obligatorio."),
        email: yup
            .string()
            .nullable()
            .email("El valor de 'email' es inválido.")
            .required("El campo 'email' es obligatorio."),
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
                    .required("Debe proporcionar un número de identificación 'cui' o 'passport'"),
                otherwise: () => yup.number(),
            }),
        lastName: yup
            .string()
            .required("El campo 'lastName' es obligatorio.")
            .min(1, "El campo 'lastName' es obligatorio."),
        name: yup
            .string()
            .required("El campo 'name' es obligatorio.")
            .min(1, "El campo 'name' es obligatorio."),
    })
    .test(
        'exclusivity',
        "Solo se permite un número de identificación 'cui' o 'passport'",
        (value) => {
            const { cui, pasaporte } = value || {};
            return !(cui && pasaporte);
        },
    );
