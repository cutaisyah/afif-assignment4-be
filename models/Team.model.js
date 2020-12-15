const mongoose = require ("mongoose");
const teamSchema = new mongoose.Schema({
    team_name : String,
    team_phone : String,
    tournamentId : {type:String, ref:"Tournament"}
});
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;