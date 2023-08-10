import { validateToken } from '../services/jwt.js';

const ensureAuth = async (req, res, next) => {
    const authToken = req.headers?.authorization;

    if (!authToken) {
        res.statusMessage = 'No se ha especificado el token de autorización.';
        return res.sendStatus(401);
    }

    try {
        const userData = await validateToken(authToken);
        req.session = userData;
        next();
    } catch (ex) {
        res.sendStatus(400);
    }

    return null;
};

const ensureDoctorAuth = async (req, res, next) => {
    const authToken = req.headers?.authorization;

    if (!authToken) {
        res.statusMessage = 'No se ha especificado el token de autorización.';
        return res.sendStatus(401);
    }

    try {
        const userData = await validateToken(authToken);

        if (userData.isDoctor !== true) {
            res.statusMessage = 'No posee privilegios de doctor.';
            return res.sendStatus(403);
        }
        req.session = userData;
        next();
    } catch (ex) {
        res.statusMessage = 'Token inválido.';
        res.sendStatus(400);
    }

    return null;
};

const ensureAdminAuth = async (req, res, next) => {
    const authToken = req.headers?.authorization;

    if (!authToken) {
        res.statusMessage = 'No se ha especificado el token de autorización.';
        return res.sendStatus(401);
    }

    try {
        const userData = await validateToken(authToken);

        if (userData.isAdmin !== true) {
            res.statusMessage = 'No posee privilegios de administrador.';
            return res.sendStatus(403);
        }
        req.session = userData;
        next();
    } catch (ex) {
        res.statusMessage = 'Token inválido.';
        res.sendStatus(400);
    }

    return null;
};

// eslint-disable-next-line import/prefer-default-export
export { ensureAuth, ensureDoctorAuth, ensureAdminAuth };
