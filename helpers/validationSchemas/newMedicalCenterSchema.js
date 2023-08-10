import yup from 'yup';

export default yup.object().shape({
    address: yup
        .string()
        .nullable()
        .required("El campo 'address' es obligatorio."),
    name: yup
        .string()
        .nullable()
        .required("El campo 'name' es obligatorio."),
    type: yup
        .string()
        .nullable()
        .required("El campo 'type' es obligatorio."),
});
