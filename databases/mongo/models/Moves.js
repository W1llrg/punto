import mongoose from "mongoose";

const MovesSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    value: { 
        type: Number, 
        required: true 
    },
    playedBy: { 
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

const Moves = mongoose.model('Moves', MovesSchema);
export default Moves;

