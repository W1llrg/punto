import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;
