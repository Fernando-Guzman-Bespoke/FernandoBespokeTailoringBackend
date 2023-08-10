import yup from 'yup';

export default yup
    .object()
    .shape({
        speciality: yup.string().required("El campo 'speciality' es obligatorio."),
        medicalCenterId: yup
            .number()
            .nullable()
            .integer("El campo 'medicalCenterId' debe ser un número entero.")
            .typeError("El campo 'medicalCenterId' debe ser un número.")
            .required("El campo 'medicalCenterId' es obligatorio."),

    });
