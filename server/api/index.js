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
    const { p1, p2 } = req.body;

    try {
        // insert players
        const query = 'INSERT INTO Player (name) VALUES (?)';
        const [p1Res] = await connection.execute(query, [p1]);
        const [p2Res] = await connection.execute(query, [p2]);

        // insert game with current timestamp
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const gameQuery = 'INSERT INTO Game (datePlayed) VALUES (?)';
        const [gameRes] = await connection.execute(gameQuery, [currentDate]);

        // insert player-game relation
        const playerGameQuery = 'INSERT INTO PlayerGame (player_id, game_id) VALUES (?, ?)';
        const p1Id = p1Res.insertId;
        const p2Id = p2Res.insertId;
        const gameId = gameRes.insertId;

        await connection.execute(playerGameQuery, [p1Id, gameId]);
        await connection.execute(playerGameQuery, [p2Id, gameId]);

        res.status(200).json({ message: 'Game added to the database' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});


/* register moves */
app.post('/mysql/register-move', async (req, res) => {
    const { name, player, value } = req.body;

    try {

        // get game id
        const gameQuery = 'SELECT id FROM Game ORDER BY id DESC LIMIT 1';
        const [gameRes] = await connection.execute(gameQuery);
        const gameId = gameRes[0].id;

        // get player id
        const playerQuery = 'SELECT id FROM Player WHERE name = ? ORDER BY id DESC LIMIT 1';
        const [playerRes] = await connection.execute(playerQuery, [player]);
        const playerId = playerRes[0].id;

        // insert move
        const query = 'INSERT INTO Moves (name, value, played_by, game_id) VALUES (?, ?, ?, ?)';
        await connection.execute(query, [name, value, playerId, gameId]);

        res.status(200).json({ message: 'Move registered' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

/* register winner */
app.post('/mysql/set-winner/:winner', async (req, res) => {
    const winner = req.params.winner;
    
    try {
        // get current game id
        const gameQuery = 'SELECT id FROM Game ORDER BY id DESC LIMIT 1';
        const [gameRes] = await connection.execute(gameQuery);
        const gameId = gameRes[0].id;

        // get winner id
        const playerQuery = 'SELECT id FROM Player WHERE name = ? ORDER BY id DESC LIMIT 1';
        const [playerRes] = await connection.execute(playerQuery, [winner]);
        const playerId = playerRes[0].id;

        // insert winner
        const query = 'INSERT INTO Winner (player_id, game_id) VALUES (?, ?)';
        await connection.execute(query, [playerId, gameId]);

        res.status(200).json({ message: 'Winner registered' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

app.get('/mysql/get-games', async (req, res) => {
    try {
        const query = `
            SELECT 
                g.id, 
                g.datePlayed, 
                p1.name AS p1, 
                p2.name AS p2, 
                w.name AS winner 
            FROM Game g 
            JOIN PlayerGame pg1 ON g.id = pg1.game_id 
            JOIN PlayerGame pg2 ON g.id = pg2.game_id 
            JOIN Player p1 ON pg1.player_id = p1.id 
            JOIN Player p2 ON pg2.player_id = p2.id 
            JOIN Winner w ON g.id = w.game_id
        `;
        const [games] = await connection.execute(query);
        res.status(200).json({ games }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

app.delete('/mysql/empty-base', async (req, res) => {
    try {
        const query = `
            DELETE FROM Game;
            DELETE FROM Player;
            DELETE FROM PlayerGame;
            DELETE FROM Winner;
            DELETE FROM Moves;
        `;
        await connection.execute(query);
        res.status(200).json({ message: 'Base emptied' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
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

    try {
        // get current game id
        const gameQuery = 'SELECT id FROM Game ORDER BY id DESC LIMIT 1';
        const gameRes = await sqliteConn.get(gameQuery);
        const gameId = gameRes.id;

        // get winner id
        const playerQuery = 'SELECT id FROM Player WHERE name = ? ORDER BY id DESC LIMIT 1';
        const playerRes = await sqliteConn.get(playerQuery, [winner]);
        const playerId = playerRes.id;

        // insert winner
        const query = 'INSERT INTO Winner (player_id, game_id) VALUES (?, ?)';
        await sqliteConn.run(query, [playerId, gameId]);

        res.status(200).json({ message: 'Winner registered' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

app.get('/sqlite/get-games', async (req, res) => {
    try {
        const query = `
            SELECT 
                g.id, 
                g.datePlayed, 
                p1.name AS p1, 
                p2.name AS p2, 
                w.name AS winner 
            FROM Game g 
            JOIN PlayerGame pg1 ON g.id = pg1.game_id 
            JOIN PlayerGame pg2 ON g.id = pg2.game_id 
            JOIN Player p1 ON pg1.player_id = p1.id 
            JOIN Player p2 ON pg2.player_id = p2.id 
            JOIN Winner w ON g.id = w.game_id
        `;
        const games = await sqliteConn.all(query);
        res.status(200).json({ games }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

app.delete('/sqlite/empty-base', async (req, res) => {
    try {
        const query = `
            DELETE FROM Game;
            DELETE FROM Player;
            DELETE FROM PlayerGame;
            DELETE FROM Winner;
            DELETE FROM Moves;
        `;
        await sqliteConn.exec(query);
        res.status(200).json({ message: 'Base emptied' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' }).end();
    }
});

// MONGODB ROUTES
// /////////////////////////////////////////////////

app.post('/mongo/start-game', async (req, res) => {
    const { p1, p2 } = req.body;

    try {
        // Insert players
        const p1Obj = await Player.create({ name: p1 });
        const p2Obj = await Player.create({ name: p2 });

        // Insert game with current timestamp
        const currentDate = new Date().toISOString();
        const gameObj = await Game.create({ datePlayed: currentDate });

        // Insert player-game relation
        const p1Id = p1Obj._id;
        const p2Id = p2Obj._id;
        const gameId = gameObj._id;

        await PlayerGame.create({ player_id: p1Id, game_id: gameId });
        await PlayerGame.create({ player_id: p2Id, game_id: gameId });

        res.status(200).json({ message: 'Game added to the database, yo!' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error, bitch!' }).end();
    }
});

app.post('/mongo/register-move', async (req, res) => {
    const { name, player, value } = req.body;

    try {
        // Get game id
        const latestGame = await Game.findOne().sort({ _id: -1 }).limit(1);
        const gameId = latestGame._id;

        // Get player id
        const playerObj = await Player.findOne({ name }).sort({ _id: -1 }).limit(1);
        const playerId = playerObj._id;

        // Insert move
        await Moves.create({ name, value, played_by: playerId, game_id: gameId });

        res.status(200).json({ message: 'Move registered, yo!' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error, bitch!' }).end();
    }
});

app.post('/mongo/set-winner/:winner', async (req, res) => {
    const winnerName = req.params.winner;

    try {
        // Get current game id
        const latestGame = await Game.findOne().sort({ _id: -1 }).limit(1);
        const gameId = latestGame._id;

        // Get winner id
        const winnerObj = await Player.findOne({ name: winnerName }).sort({ _id: -1 }).limit(1);
        const winnerId = winnerObj._id;

        // Insert winner
        await Winner.create({ player_id: winnerId, game_id: gameId });

        res.status(200).json({ message: 'Winner registered, yo!' }).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error, bitch!' }).end();
    }
});


// PORT
// /////////////////////////////////////////////////

const port = process.env.PORT + 1 || 3001;
app.listen(port, () => {
    console.log(`>> >> Server listening on port ${port}`);
});