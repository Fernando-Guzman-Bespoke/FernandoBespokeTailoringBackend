import jwt from 'jsonwebtoken';
import key from '../config/key.js';

const signToken = async ({
    name, lastName, sex, isAdmin, isDoctor,
}) => jwt.sign({
    name,
    lastName,
    sex,
    isAdmin,
    isDoctor,
}, key);

const validateToken = async (token) => jwt.verify(token, key);

export { signToken, validateToken };
