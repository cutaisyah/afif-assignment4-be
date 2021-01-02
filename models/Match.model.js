const mongoose = require ("mongoose");
const matchSchema = new mongoose.Schema({
    tournament: {type: mongoose.Schema.Types.ObjectId, ref: "Tournament"},
    team: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},
    score: {type: Number, default: 0},
    match_round: {type: Number, default: 1},
    isEliminate: {type: Boolean, default:0}
});
const Match = mongoose.model("Match", matchSchema);
module.exports = Match;