const Match = require ("../models/Match.model");
const Team = require ("../models/Team.model");
const TournamentApproved = require ("../models/TournamentApproved.model");


class matchController {
    static createMatch (req,res){
        const {tournament_name} = req.body;
        TournamentApproved.find({tournament_name})
        .then(result=>{
            console.log(result);
        })
        
        // var json = [{"teams":"team 1"}, {"teams":"team 2"}, {"teams":"team 3"}, {"teams":"team 4"}]
        // var match = [];
        // var teams = []; 

        // json.map((data,index)=>{
        //     teams.push(data.teams)
        //     if (index%2!==0){
        //         match.push(teams)
        //         teams = []
        //     }
        // })
    }

}

module.exports = matchController;