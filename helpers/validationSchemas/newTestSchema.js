import yup from 'yup';

export default yup.object().shape({

    patientId: yup
        .number()
        .nullable()
        .integer("El campo 'patientId' debe ser un número entero.")
        .typeError("El campo 'patientId' debe ser un número.")
        .required("El campo 'patientId' es obligatorio."),
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
