// medicalCenterId, supplyId, quantityAvailable, maxStock,

import yup from 'yup';

export default yup
    .object()
    .shape({
        medicalCenterId: yup
            .number()
            .nullable()
            .integer("El campo 'medicalCenterId' debe ser un número entero.")
            .typeError("El campo 'medicalCenterId' debe ser un número.")
            .required("El campo 'medicalCenterId' es obligatorio."),
        supplyId: yup
            .number()
            .nullable()
            .integer("El campo 'supplyId' debe ser un número entero.")
            .typeError("El campo 'supplyId' debe ser un número.")
            .required("El campo 'supplyId' es obligatorio."),
        quantityAvailable: yup.number()
            .nullable()
            .integer("El campo 'quantityAvailable' debe ser un número entero.")
            .typeError("El campo 'quantityAvailable' debe ser un número.")
            .required("El campo 'quantityAvailable' es obligatorio."),
        maxStock: yup.number()
            .nullable()
            .integer("El campo 'maxStock' debe ser un número entero.")
            .typeError("El campo 'maxStock' debe ser un número.")
            .required("El campo 'maxStock' es obligatorio."),

    });
