import query from '../../database/query.js';
import CustomError from '../../helpers/customError.js';

const mostDeadlyDiseases = async () => {
    const sql = `SELECT d.nombre_enfermedad as disease, COUNT(*) as deaths_number
                  FROM procedimiento p 
                  INNER JOIN diagnostico d ON p.id_consulta = d.id_consulta 
                  INNER JOIN evolucion_paciente e ON p.id_procedimiento = e.id_procedimiento 
                  WHERE e.fallecido = true 
                  GROUP BY d.nombre_enfermedad 
                  ORDER BY deaths_number DESC 
                  LIMIT 10`;

    const { result, rowCount } = await query(sql);

    if (rowCount === 0) throw new CustomError('No se encontraron enfermedades mortales.', 404);

    return result;
};

const doctorsWithMorePatients = async () => {
    const sql = `SELECT CONCAT(usu.nombre,' ', usu.apellido) AS name, COUNT(DISTINCT p.id_paciente) as patients_number
                FROM medicos_procedimiento medpro
                INNER JOIN procedimiento pro ON pro.id_procedimiento = medpro.id_procedimiento
                INNER JOIN paciente p ON p.id_paciente = pro.id_paciente
                INNER JOIN medico med ON med.id_medico = medpro.id_medico
                INNER JOIN usuario usu ON usu.id_medico = med.id_medico
                GROUP BY usu.id_medico,usu.nombre, usu.apellido,med.id_medico
                ORDER BY patients_number DESC
                LIMIT 10`;

    const { result, rowCount } = await query(sql);

    if (rowCount === 0) throw new CustomError('No se encontraron doctores con pacientes.', 404);

    return result;
};
const patientsWithMoreVisits = async () => {
    const sql = `SELECT CONCAT(p.nombres,' ', p.apellidos) as name, p.peso as weight ,p.altura as height, 
                  ROUND(CAST((p.peso/p.altura) AS NUMERIC), 2) as IMC , p.sexo as sex , 
                  date_part('year', age(fecha_nacimiento)) AS age, COUNT(*) AS visits_number
                  FROM paciente p
                  INNER JOIN procedimiento pro ON pro.id_paciente = p.id_paciente
                  INNER JOIN unidad_salud us ON us.id_unidad_salud = pro.id_unidad_salud
                  GROUP BY p.id_paciente
                  ORDER BY visits_number DESC
                  LIMIT 5;`;

    const { result, rowCount } = await query(sql);

    if (rowCount === 0) { throw new CustomError('No se encontraron pacientes con consultas o cirugias.', 404); }

    return result;
};
const medicalCenterWithMorePatients = async () => {
    const sql = `SELECT  us.nombre AS name, COUNT(DISTINCT pro.id_paciente) AS patients_number
                  FROM unidad_salud us
                  INNER JOIN procedimiento pro ON pro.id_unidad_salud = us.id_unidad_salud
                  GROUP BY us.id_unidad_salud
                  ORDER BY patients_number DESC
                  LIMIT 3;
                  `;

    const { result, rowCount } = await query(sql);

    if (rowCount === 0) { throw new CustomError('No se encontraron unidades medicas con pacientes.', 404); }

    return result;
};

export {
    mostDeadlyDiseases,
    doctorsWithMorePatients,
    patientsWithMoreVisits,
    medicalCenterWithMorePatients,
};
