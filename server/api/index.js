import express from 'express';
import mysql from 'mysql2/promise';
import morgan from 'morgan';
import cors from 'cors';


// MYSQL DATABASE CONNECTION
// /////////////////////////////////////////////////

let connection;
mysql.createConnection({
    host: 'localhost',
    user: 'puntoadmin',
    password: '0xOaft2uX6qsxdHh9XF5DRbmxRUve17x0ca6KSCxfIsaEulg',
    database: 'punto',
}).then(conn => {
    connection = conn;
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection failed: ' + err);
});


// EXPRESS SERVER
// /////////////////////////////////////////////////

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));


// ROUTES
// /////////////////////////////////////////////////

/* test to check for the server */
app.get('/api', async (req, res) => {
    res.json({ message: 'Hello from server!' });
});

/* add the game to the db */
app.post('/mysql/start-game', async (req, res) => {
    // TODO
});

/* register moves */
app.post('/mysql/register-move', async (req, res) => {
    // TODO
});

/* register winner */
app.post('/mysql/set-winner', async (req, res) => {
    // TODO
});


// PORT
// /////////////////////////////////////////////////

const port = process.env.PORT + 1 || 3001;
app.listen(port, () => {
    console.log(`>> >> Server listening on port ${port}`);
});