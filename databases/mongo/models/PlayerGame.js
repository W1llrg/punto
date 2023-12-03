import mongoose from "mongoose";

const PlayerGameSchema = new mongoose.Schema({
    player: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player', 
        required: true 
    },
    game: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Game', 
        required: true 
    },
});

const PlayerGame = mongoose.model('PlayerGame', PlayerGameSchema);
export default PlayerGame;