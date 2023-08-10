import yup from 'yup';

export default yup
    .object()
    .shape({

        diagnostics: yup
            .array()
            .of(
                yup
                    .object()
                    .shape({
                        disease: yup.string().required("Todos los diagnosticos deben incluir la propiedad 'disease'."),
                        symptoms: yup.string().required("Todos los diagnosticos deben incluir la propiedad 'symptoms'."),
                    })
                    .typeError("Los valores del arreglo 'diagnostics' deben ser objectos con la forma {disease, description(opcional).}."),
            )
            .typeError("El campo 'diagnostics' debe ser un arreglo."),
    });
