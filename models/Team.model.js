const mongoose = require ("mongoose");
const teamSchema = new mongoose.Schema({
    team_name : {type: String, unique: true, required: true},
    team_phone : {type: String, unique: true, required: true},
});
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;