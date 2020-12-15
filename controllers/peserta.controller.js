const User = require ("../models/User.model");
const Role = require ("../models/Role.model");
const District = require ("../models/District.model");
const Team = require ("../models/Team.model");
const Tournament = require ("../models/Tournament.model");
const TournamentApproved = require ("../models/TournamentApproved.model");



class pesertaController {

    static updatePeserta (req,res,next){
        const {userId} = req.params;
        const {username, email, password, birthdate, phone} = req.body;
        const updatedData =  {username, email, password, birthdate, phone}
        for (let key in updatedData){
            if(!updatedData[key]){
              delete updatedData[key]
            }
        }
        User.findByIdAndUpdate(userId, updatedData, {new:true})
        .then((peserta)=>{
            res.status(200).json({message:'Berhasil mengupdate data peserta', updated:peserta});
        })
        .catch(next);
    }

    static getPesertaId (req,res,next){
        const {userId} = req.params;
        User.findById(userId)
        .populate("roles")
        .populate("districts")
        .then(result=>{
            res.status(200).json({message:'Berhasil mendapatkan data peserta', data:result});
        })
        .catch(next);
    }

    static createTeam (req,res,next){
        const {team_name, team_phone} = req.body;
        const team = new Team({team_name, team_phone});
        team.save()
        .then((team)=>{
            res.status(201).json({ message: "Peserta berhasil mendaftarkan team", data: team});
        })
        .catch(next)
    }

    static registerTeam (req,res,next){
        const {userId} = req.params;
        const {teams} = req.body;
        
        User.findByIdAndUpdate(userId,{teams:teams})
        .then((peserta)=>{
            if(req.body.teams){
                Team.find({team_name:{$in:req.body.teams}}, (err, team)=>{
                    if(err) {res.status(500).send({ message: err }); return;}
                    team.teams = teams.map(team=>team._id);
                })
                
            }
            res.status(200).json({message:'Berhasil mendaftar pada team', peserta});
        })
        .catch(next);

    }

    static pesertaRegisterTournament (req,res,next){
        const {userId} = req.params;
        const {tournament_name, status} = req.body;
        User.findById(userId)
        .then(user=>{
            const participant = user
            TournamentApproved.create({status, tournament_name, participant}, (err, approved)=>{
                console.log(req.body.tournament_name);
                if(err){res.status(500).json({message:err}); return;}
                res.status(201).json({message:"berhasil gabung tim", approved});
            })
        })
        .catch(next);
       
    }

    static teamRegisterTournament (req,res,next){
        const {teamId} = req.params;
        const {tournament_name, status} = req.body;
        Team.findById(teamId)
        .then(team=>{
            console.log(team);
            const participant = team
            TournamentApproved.create({status, tournament_name, participant}, (err,approved)=>{
                if(err){res.status(500).json({message:err}); return;}
                res.status(200).json({message:"berhasil mendaftarkan tim ke tournament", approved});
            })
        })
        .catch(next);
    }

}

module.exports = pesertaController;