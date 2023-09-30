import sha256 from 'js-sha256';
import CustomError from '../../helpers/customError.js';
import {
    authenticate, createAdmin, createUser, getUsersList, getClients,
    getUserData, updateUser,
} from './user.model.js';
import { signToken } from '../../services/jwt.js';

const createAdminController = async (req, res) => {
    const {
        cui, passport, name, lastName, email, sex, password,
    } = req.body;

    try {
        const adminId = await createAdmin();

        const passwordHash = sha256(password);
        const userId = await createUser({
            cui,
            passport,
            name,
            lastName,
            email,
            sex,
            passwordHash,
            adminId,
        });

        res.status(200).send({ id: userId });
    } catch (ex) {
        res.statusMessage = ex?.message ?? 'Ocurrió un error.';
        if (ex instanceof CustomError) {
            return res.status(ex.status).send({ err: ex.message, status: ex.status });
        }
        res.sendStatus(500);
    }
    return null;
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const passwordHash = sha256(password);
        // console.log(passwordHash)
        const authResult = await authenticate({ email, password });
        const token = await signToken(authResult);

        res.status(200).send({ ...authResult, token });
    } catch (ex) {
        res.statusMessage = ex?.message ?? 'Ocurrió un error.';
        if (ex instanceof CustomError) return res.status(ex.status).send({ err: ex.message });
        res.sendStatus(500);
    }
    return null;
};

const getUsersListController = async (req, res) => {
    try {
        const result = await getUsersList();
        res.send(result);
    } catch (ex) {
        let error = 'Ocurrió un error en el servidor';
        let status = 500;
        if (ex instanceof CustomError) {
            error = ex.message;
            status = ex.status;
        }
        res.statusMessage = error;
        res.status(status).send({ err: error, status });
    }
};

const getClientController = async (req, res) => {
    const { search } = req.query;
    try {
        const { result, rowCount } = await getClients({ search });
        if (rowCount === 0) return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 });
        return res.send(result);
    } catch (ex) {
        res.statusMessage = 'Ocurrió un error.';
        return res.status(500).send({ err: 'Ocurrió un error.', status: 500 });
    }
};

const getUserDataController = async (req, res) => {
    const { userId } = req.params;

    try {
        const { result, rowCount } = await getUserData(userId);
        if (rowCount === 0) return res.status(404).send({ err: 'No se encontraron resultados.', status: 404 });
        return res.send(result[0]);
    } catch (ex) {
        res.statusMessage = 'Ocurrió un error.';
        return res.status(500).send({ err: 'Ocurrió un error.', status: 500 });
    }
};

const updateUserController = async (req, res) => {
    const { userId } = req.params;
    const {
        name, lastName, email, sex, password, speciality, cui, passport,
        // eslint-disable-next-line camelcase
        medicalcenterid, admin_id, doctor_id,
    } = req.body;
    try {
        // eslint-disable-next-line max-len
        await updateUser(userId, name, lastName, cui, passport, email, sex, password, speciality, medicalcenterid, admin_id, doctor_id);
        res.sendStatus(200);
    } catch (ex) {
        let err = 'Ocurrio un error al actualizar el usuario.';
        let status = 500;
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status;
        }
        res.statusMessage = err;
        res.status(status).send({ err, status });
    }
};

export {
     login, createAdminController, getUsersListController,
     getClientController, getUserDataController, updateUserController,
};
