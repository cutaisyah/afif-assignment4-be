const mongoose = require ("mongoose");
const tournamentPrizeSchema = new mongoose.Schema({
    tournament_name: String,
    first_prize: String,
    second_prize: String,
    third_prize: String,
});
const TournamentPrize = mongoose.model("TournamentPrize", tournamentPrizeSchema);
module.exports = TournamentPrize;