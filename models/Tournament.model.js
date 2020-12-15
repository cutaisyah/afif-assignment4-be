const mongoose = require ("mongoose");

const tournamentsSchema = new mongoose.Schema({
    id_user_panitia: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    tournament_name:String,
    image:{data:Buffer, contentType:String},
    total_participant:Number,
    age_minimum:Number,
    description: {type: String},
    is_started: [{type: mongoose.Schema.Types.ObjectId, ref: "TournamentIsStarted"}],
    categories: [{type: String, ref: "TournamentCategory"}],
    id_prize: [{type: mongoose.Schema.Types.ObjectId, ref: "TournamentPrize"}],
    first_winner: {type: String, ref: "Team"},
    second_winner: {type: String, ref: "Team"},
    third_winner: {type: String, ref: "Team"},
    districts: [{type: String, ref: "District"}],
});

const Tournament = mongoose.model("Tournament", tournamentsSchema);
module.exports = Tournament;