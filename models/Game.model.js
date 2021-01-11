const mongoose = require ("mongoose");
const gameSchema = new mongoose.Schema({
    game_name: {type: String, required: true, unique: true}
});
const Game = mongoose.model("Game", gameSchema);
module.exports = Game;