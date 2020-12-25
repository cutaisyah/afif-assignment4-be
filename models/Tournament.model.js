const mongoose = require ("mongoose");

const tournamentsSchema = new mongoose.Schema({
    id_user_panitia: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tournament_name: {type: String, required: true},
    game: {type: String, ref: "Game"},
    image:{type: String, required: true},
    total_participant: {type: Number, required: true, max: 100},
    age_minimum: {type: Number, required: true},
    description: {type: String, required: true},
    permalink: {type: String, unique:true, required: true },
    is_started: {type: String, enum: ["pending", "ongoing", "complete"]},
    categories: {type: String, enum: ["single elimination", "free for all"], required: true},
    id_prize: {type: String, ref: "TournamentPrize"},
    first_winner: {type: String, ref: "Team"},
    second_winner: {type: String, ref: "Team"},
    third_winner: {type: String, ref: "Team"},
    districts: {type: mongoose.Schema.Types.ObjectId, ref: "District"},
});

const Tournament = mongoose.model("Tournament", tournamentsSchema);
module.exports = Tournament;