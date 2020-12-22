const mongoose = require ("mongoose");

const tournamentsSchema = new mongoose.Schema({
    id_user_panitia: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tournament_name: {type: String},
    game: {type: String, ref: "Game"},
    image:{data:Buffer, contentType:String},
    total_participant: {type: Number, max: 100},
    age_minimum: {type: Number},
    description: {type: String},
    permalink: {type: String, unique:true },
    is_started: {type: String, enum: ["pending", "ongoing", "complete"]},
    categories: {type: String, enum: ["single elimination", "free for all"]},
    id_prize: {type: String, ref: "TournamentPrize"},
    first_winner: {type: String, ref: "Team"},
    second_winner: {type: String, ref: "Team"},
    third_winner: {type: String, ref: "Team"},
    districts: {type: String, ref: "District"},
});

const Tournament = mongoose.model("Tournament", tournamentsSchema);
module.exports = Tournament;