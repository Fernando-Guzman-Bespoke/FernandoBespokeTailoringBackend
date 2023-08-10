import express from 'express';
import routes from './routes/index.js';
// eslint-disable-next-line no-unused-vars
import getDirname from './helpers/dirname.js';
import setOrigin from './middleware/setOrigin.js';

const app = express();

global.dirname = getDirname(import.meta.url);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(setOrigin);
app.use(express.static('./public'));
app.use(routes);

process.on('unhandledRejection', (error) => {
    console.log('=== UNHANDLED REJECTION ===');
    console.dir(error);
});

export default app;
