const mongoose = require ("mongoose");
const gameSchema = new mongoose.Schema({
    game_name: String
});
const Game = mongoose.model("Game", gameSchema);
module.exports = Game;