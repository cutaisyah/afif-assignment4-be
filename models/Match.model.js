const mongoose = require ("mongoose");
const matchSchema = new mongoose.Schema({
    id_tournament: [{type: mongoose.Schema.Types.ObjectId, ref: "Tournament"}],
    id_team: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}],
    score: Number,
    timestamp: Number
});
const Match = mongoose.model("Match", matchSchema);
module.exports = Match;