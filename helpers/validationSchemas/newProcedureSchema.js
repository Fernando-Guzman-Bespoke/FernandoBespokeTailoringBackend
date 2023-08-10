import yup from 'yup';

export default yup.object().shape({

    patientEvolution: yup.string().nullable().required("El campo 'patientEvolution' es obligatorio."),
    patientDead: yup.bool().nullable().typeError("El campo 'patientDead' debe ser un valor booleano."),
    doctors: yup
        .array()
        .of(
            yup
                .number()
                .integer("Los valores del arreglo 'doctors' deben ser números enteros.")
                .typeError("Los valores del arreglo 'doctors' deben ser números."),
        )
        .min(1, "El arreglo 'doctors' debe tener al menos un doctor.")
        .typeError("El campo 'doctors' debe ser un arreglo.")
        .required("El campo 'doctors' es obligatorio."),
    prescriptions: yup
        .array()
        .of(
            yup.object()
                .shape({
                    medicineId: yup
                        .number()
                        .integer("Los valores de 'medicineId' deben ser números enteros.")
                        .typeError("Los valores de 'medicineId' deben deben ser números.")
                        .required("El valor 'medicineId' se require como parte de la receta."),
                    dose: yup
                        .string()
                        .nullable()
                        .required("El valor 'dose' se require como parte de la receta."),
                })
                .typeError("El campo 'prescriptions' debe ser un arreglo de objectos de la forma {medicineId, dose}."),
        )
        .typeError("El campo 'prescriptions' debe ser un arreglo."),
    medicalCenterId: yup
        .number()
        .nullable()
        .integer("El campo 'medicalCenterId' debe ser un número entero.")
        .typeError("El campo 'medicalCenterId' debe ser un número.")
        .required("El campo 'medicalCenterId' es obligatorio."),
    patientId: yup
        .number()
        .nullable()
        .integer("El campo 'patientId' debe ser un número entero.")
        .typeError("El campo 'patientId' debe ser un número.")
        .required("El campo 'patientId' es obligatorio."),
});
