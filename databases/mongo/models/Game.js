import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    datePlayed: { 
        type: Date, 
        required: true 
    },
});
const Game = mongoose.model('Game', GameSchema);
export default Game;