const mongoose = require ("mongoose");
const tournamentApprovedSchema = new mongoose.Schema({
    tournament_name: String,
    status: {type:Number, default:0},
    participant: Array
});
const TournamentApproved = mongoose.model("TournamentApproved", tournamentApprovedSchema);
module.exports = TournamentApproved;