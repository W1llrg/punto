import express from 'express';
import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';


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
    console.log('>> MYSQL: Database connection established');
}).catch(err => {
    console.error('>> MYSQL: Database connection failed: ' + err);
});


// MONGODB DATABASE CONNECTION
// /////////////////////////////////////////////////

// import models
import Game from '../../databases/mongo/models/Game.js';
import Player from '../../databases/mongo/models/Player.js';
import Winner from '../../databases/mongo/models/Winner.js';
import Moves from '../../databases/mongo/models/Moves.js';
import PlayerGame from '../../databases/mongo/models/PlayerGame.js';

// connect to database
mongoose.connect(`mongodb://0.0.0.0:27017/punto`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('>> MONGO: Database connection established');
});
mongoose.connection.on('error', (err) => {
    console.error('>> MONGO: Database connection failed: ', err);
});


// SQLITE DATABASE CONNECTION
// /////////////////////////////////////////////////

let sqliteConn;
open({
    filename: 'server/db/punto.sqlite',
    driver: sqlite3.Database
}).then((db) => {
    sqliteConn = db;
    if (sqliteConn) {
        console.log('>> SQLITE: Database connection established');
    } else {
        console.error('>> SQLITE: Database connection failed');
    }
})


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


// MYSQL ROUTES
// /////////////////////////////////////////////////

/* add the game to the db */
app.post('/mysql/start-game', async (req, res) => {
    const query = 'INSERT INTO Game (datePlayed) VALUES (?)';
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    connection.query(query, [formattedDate], (err, results) => {
        if (err) {
            console.log(err);
            res.json({ message: 'Error' });

            return;
        }
        console.log('Game added to the database: ' + results);
        res.status(200).json({ message: 'Game added to the database'}).end(); 
    });

});


/* register moves */
app.post('/mysql/register-move', async (req, res) => {
    const move = req.body.move;
    const player = req.body.p1;
    const game = req.body.game;
    const value = req.body.value;

    const query = 'INSERT INTO Moves (name, value, played_by, game_id) VALUES (?, ?, ?, ?)';
    connection.query(query, [move, value, player, game], (err, results) => {
        if (err) {
            console.log(err);
            res.json({ message: 'Error' });

            return;
        }
        console.log('Move registered: ' + results);
        res.status(200).json({ message: 'Move registered'}).end(); 
    });
});

/* register winner */
app.post('/mysql/set-winner/:winner', async (req, res) => {
    const winner = req.params.winner;
    const game = req.body.game;

    const query = 'INSERT INTO Winner (player_id, game_id) VALUES (?, ?)';
});


// SQLITE ROUTES
// /////////////////////////////////////////////////

/* add the game to the db */
app.post('/sqlite/start-game', async (req, res) => {
    const { p1, p2 } = req.body;

    try {

        // insert players
        const query = 'INSERT INTO Player (name) VALUES (?)';
        const p1Res = await sqliteConn.run(query, [p1]);
        const p2Res = await sqliteConn.run(query, [p2]);

        // insert game with current timestamp
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const gameQuery = 'INSERT INTO Game (datePlayed) VALUES (?)';
        const gameRes = await sqliteConn.run(gameQuery, [currentDate]);

        // insert player-game relation
        const playerGameQuery = 'INSERT INTO PlayerGame (player_id, game_id) VALUES (?, ?)';
        const p1Id = p1Res.lastID;
        const p2Id = p2Res.lastID;
        const gameId = gameRes.lastID;
        await sqliteConn.run(playerGameQuery, [p1Id, gameId]);
        await sqliteConn.run(playerGameQuery, [p2Id, gameId]);

        res.status(200).json({ message: 'Game added to the database' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

/* register moves */
app.post('/sqlite/register-move', async (req, res) => {
    const { name, player, value } = req.body;

    try {
        // get game id
        const gameQuery = 'SELECT id FROM Game ORDER BY id DESC LIMIT 1';
        const gameRes = await sqliteConn.get(gameQuery);
        const gameId = gameRes.id;

        // get player id
        const playerQuery = 'SELECT id FROM Player WHERE name = ? ORDER BY id DESC LIMIT 1';
        const playerRes = await sqliteConn.get(playerQuery, [player]);
        const playerId = playerRes.id;

        // insert move
        const query = 'INSERT INTO Moves (name, value, played_by, game_id) VALUES (?, ?, ?, ?)';
        await sqliteConn.run(query, [name, value, playerId, gameId]);

        res.status(200).json({ message: 'Move registered' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

/* register winner */
app.post('/sqlite/set-winner/:winner', async (req, res) => {
    const winner = req.params.winner;
    const game = req.body.game;

    const query = 'INSERT INTO Winner (player_id, game_id) VALUES (?, ?)';
});


// PORT
// /////////////////////////////////////////////////

const port = process.env.PORT + 1 || 3001;
app.listen(port, () => {
    console.log(`>> >> Server listening on port ${port}`);
});