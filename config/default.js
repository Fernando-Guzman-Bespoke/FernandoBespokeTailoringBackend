import { config } from 'dotenv';

config();

const port = 2000;
const host = 'localhost';
const dbHost = process.env.DEFAULT_DB_HOST;
const dbName = process.env.DEFAULT_DB_NAME;
const dbUser = process.env.DEFAULT_DB_USER;
const dbPassword = process.env.DEFAULT_DB_PASSWORD;
const dbPort = process.env.DEFAULT_DB_PORT;

export {
    port, host, dbName, dbUser, dbPassword, dbHost, dbPort,
};
