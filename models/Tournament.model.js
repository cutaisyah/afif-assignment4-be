const mongoose = require ("mongoose");

const tournamentsSchema = new mongoose.Schema({
    id_user_panitia: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tournament_name: {type: String, required: true, unique: true},
    game: {type: String, ref: "Game"},
    image:{type: String, required: true},
    register_total_participant: {type: Number, default: 0},
    max_total_participant: {type: Number, required: true, max: 100},
    age_minimum: {type: Number, required: true},
    description: {type: String, required: true},
    permalink: {type: String, unique:true, required: true },
    is_started: {type: String, enum: ["pending", "ongoing", "completed"], default: "pending"},
    categories: {type: String, enum: ["single elimination", "free for all"], required: true},
    first_prize: {type: String, default:""},
    second_prize: {type: String, default:""},
    third_prize: {type: String, default:""},
    first_winner: {type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null},
    second_winner: {type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null},
    third_winner: {type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null},
    districts: {type: mongoose.Schema.Types.ObjectId, ref: "District"},
});

const Tournament = mongoose.model("Tournament", tournamentsSchema);
module.exports = Tournament;