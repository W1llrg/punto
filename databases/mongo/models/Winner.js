import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema({
    game: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Game', 
        required: true 
    },
    player: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player', 
        required: true 
    },
});

const Winner = mongoose.model('Winner', WinnerSchema);
export default Winner;