import pgPkg from 'pg';
import {
    dbUser, dbHost, dbName, dbPassword, dbPort,
} from '../config/default.js';

const { Pool } = pgPkg;

const pool = new Pool({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
});

export default pool;
