const mongoose = require ("mongoose");
const tournamentIsStartedSchema = new mongoose.Schema({
    condition_name: String
});
const TournamentIsStarted = mongoose.model("TournamentIsStarted", tournamentIsStartedSchema);
module.exports = TournamentIsStarted;