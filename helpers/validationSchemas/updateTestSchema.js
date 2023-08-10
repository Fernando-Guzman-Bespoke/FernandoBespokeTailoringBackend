import yup from 'yup';

export default yup.object().shape({

    testId: yup
        .number()
        .nullable()
        .integer("El campo 'testId' debe ser un número entero.")
        .typeError("El campo 'testId' debe ser un número.")
        .required("El campo 'testId' es obligatorio."),
    testTypeId: yup
        .number()
        .nullable()
        .integer("El campo 'testTypeId' debe ser un número entero.")
        .typeError("El campo 'testTypeId' debe ser un número.")
        .required("El campo 'testTypeId' es obligatorio."),

    testResult: yup
        .string()
        .nullable()
        .required("El campo 'testResult' es obligatorio."),
});
