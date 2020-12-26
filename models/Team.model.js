const mongoose = require ("mongoose");
const teamSchema = new mongoose.Schema({
    team_name : {type: String, unique: true, required: true},
    team_phone : {type: String, unique: true, required: true},
    // tournamentId : {type:String, ref:"Tournament"}
});
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;