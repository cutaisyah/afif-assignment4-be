const User = require("../models/User.model");
const Role = require("../models/Role.model");
const District = require("../models/District.model");
const Team = require("../models/Team.model");
const Tournament = require("../models/Tournament.model");
const TournamentApproved = require("../models/TournamentApproved.model");
const bcrypt = require("bcrypt");

class pesertaController {
  static updatePeserta(req, res, next) {
    const userId = req.userId;
    const { username, email, birthdate, phone } = req.body;
    const updatedData = { username, email, birthdate, phone };
    console.log(updatedData)
    for (let key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }
    User.findByIdAndUpdate(userId, updatedData, { new: true })
      .then((peserta) => {
        res.status(200).json({message: "Berhasil mengupdate data peserta", updated: peserta});
      })
      .catch(next);
  }

  static changePassword(req, res, next) {
    const userId = req.userId;
    let password = bcrypt.hashSync(req.body.password,8);
    let old_password = bcrypt.hashSync(req.body.old_password,8);
    const updatedData = { password, old_password };
    console.log(updatedData);
    // for (let key in updatedData){
    //     if(!updatedData[key]){
    //       delete updatedData[key]
    //     }
    // }
    //verifakisi
    User.findById(userId)
      .then((result) => {
        //   console.log(result);
        var passwordIsValid = bcrypt.compareSync(
          req.body.old_password,
          result.password
        );
        if (!passwordIsValid) {
          res.status(400).json({
            message: "Verifikasi Password tidak sesuai",
            updated: result,
          });
        } else {
          User.findByIdAndUpdate(userId, updatedData, { new: true })
            .then((result) => {
            //   console.log(result);
            //   const a = bcrypt.hashSync(result.password, 8);
            //   console.log(a);
            //   result.old_password == a;
              result.old_password == result.password;
              result.password == req.body.password;
            //   console.log(result);
              res.status(200).json({
                message: "Berhasil mengupdate data password",
                updated: result,
              });
            })
            .catch(next);
        }
      })
      .catch(next);
  }

  static getPesertaId(req, res, next) {
    const { userId } = req.params;
    User.findById(userId)
      .populate("roles")
      .populate("districts")
      .populate("teams")
      .then((result) => {
        res
          .status(200)
          .json({ message: "Berhasil mendapatkan data peserta", data: result });
      })
      .catch(next);
  }
  
  static createTeam(req, res, next) {
    const { team_name, team_phone } = req.body;
    const team = new Team({ team_name, team_phone });
    User.findById(req.userId)
    .then(user => {
      if(user.teams !== null){
        res.status(400).json({ message: "Anda Sudah terdaftar dalam Team"});
      } 
      else{
        team.save()
        .then((team) => {
            user.teams = team._id
            user.save();
            return res.status(201).json({ message: "Peserta berhasil mendaftarkan team", data: team });
        })
        .catch(next);
      }
    })
    .catch(next);
  }

  static getTeamPeserta(req,res,next){
    // console.log();
    // const { teamId } = req.params
    // console.log(teamId)
    // console.log("teamId",typeof(teamId))
    // Team.findById(req.userTeam)
    // .exec((err,team)=>{
    //   if(err){
    //     res.status(500).json(err)
    //   } else if (!team){
    //     res.status(400).json("Tidak ada team")
    //   } else {
        User.find({teams:req.userTeam})
        // .populate("teams")
        .then((user)=> {
          res.status(200).json(user)
        })
        .catch(next)
    //   }
    // }) 
  }

  // static registerTeam(req, res, next) {
  //   const { teams } = req.body;

  //   User.findByIdAndUpdate(req.userId, { teams: teams })
  //     .then((peserta) => {
  //       if (req.body.teams) {
  //         Team.find({ team_name: { $in: req.body.teams } }, (err, team) => {
  //           if (err) {
  //             res.status(500).send({ message: "Nama Team Sudah Ada" });
  //             return;
  //           }
  //           team.teams = teams.map((team) => team._id);
  //         });
  //       }
  //       res
  //         .status(200)
  //         .json({ message: "Berhasil mendaftar pada team", peserta });
  //     })
  //     .catch(next);
  // }

  // static pesertaRegisterTournament(req, res, next) {
  //   const { userId } = req.params;
  //   const { tournament_name, status } = req.body;
  //   User.findById(userId)
  //     .then((user) => {
  //       const participant = user;
  //       TournamentApproved.create({ status, tournament_name, participant },
  //         (err, approved) => {
  //           console.log(req.body.tournament_name);
  //           if (err) {
  //             res.status(500).json({ message: err });
  //             return;
  //           }
  //           res.status(201).json({ message: "berhasil gabung tim", approved });
  //         }
  //       );
  //     })
  //     .catch(next);
  // }

  static pesertaRegisterTournament(req, res, next) {
    const { permalink } = req.params;
    // console.log(tournamentId);
    Tournament.findOne({permalink: permalink})
    .populate("districts")
    .then(tournament => {
      if(tournament.register_total_participant >= tournament.max_total_participant ){
        console.log("Sudah Penuh")
        res.status(400).json({success: false, message : "Sudah Penuh"})
      } else if(tournament.is_started == "ongoing" || tournament.is_started == "completed" ) {
        console.log("Tournament Sudah Dimulai")
        res.status(400).json({success: false, message : "Tournament Sudah Dimulai"})
      } else {
        User.findById(req.userId)
        .populate("districts")
        .then(user => {
          let ageDifMs = Date.now() - user.birthdate.getTime();
          let ageDate = new Date(ageDifMs); // miliseconds from epoch
          const userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
          // console.log(userAge);
          if(userAge < tournament.age_minimum){
            console.log("Peserta dibawah umur ketentuan")
            res.status(400).json({success: false, message : "Peserta dibawah umur ketentuan"})
          }
          else if(user.tournament_register !== null){
            console.log("Peserta Sudah Pernah Terdaftar")
            res.status(400).json({success: false, message : "Peserta Sudah Pernah Terdaftar"})
          }else if(req.userRole == "admin" || req.userRole == "panitia" || req.userRole == "lurah" ){
            res.status(400).json({success: false, message : "Hanya Peserta Yang Dapat Mendaftar"})
          } else {
            user.tournament_register = tournament._id;
            ++tournament.register_total_participant;
            user.save();
            tournament.save();
            res.status(200).json({success: true, message : "Peserta Berhasil Mendaftar"})
          }
        })
      }
    }).catch(next);
  }

  // static teamRegisterTournament(req, res, next) {
  //   const { teamId } = req.params;
  //   const { tournament_name, status } = req.body;
  //   Team.findById(teamId)
  //     .then((team) => {
  //       console.log(team);
  //       const participant = team;
  //       TournamentApproved.create(
  //         { status, tournament_name, participant },
  //         (err, approved) => {
  //           if (err) {
  //             res.status(500).json({ message: err });
  //             return;
  //           }
  //           res.status(200).json({
  //             message: "berhasil mendaftarkan tim ke tournament",
  //             approved,
  //           });
  //         }
  //       );
  //     })
  //     .catch(next);
  // }

  static pesertaRegisterOtherPesertaToTeam(req, res, next){
    //user cari temen yang udah register ke turnament itu
    //user pilih temennya
    //temennya terdaftar di team itu
    const {username} = req.body;
    User.findOne({username: username})
    .populate("districts")
    .then((member) => {
      // console.log(member);
      if(member == null){
        res.status(400).json({ message: "username tidak ditemukan" });
      } else if(member.districts._id.toString() !== req.userDistrict._id){
        res.status(400).json({ message: "beda district" });
      } else if(member.teams !== null){
        res.status(400).json({ message: "sudah terdaftar di member lain" });
      } else{
        User.findById(req.userId)
        .then((leader) => {
          if(leader.teams == null){
            res.status(400).json({ message: "Buat Team Terlebih dahulu!" });
          }else if(leader.tournament_register == null){
            res.status(400).json({ message: "Pilih Tournament terlebih dahulu!" });
          }else if(leader.tournament_register.toString() !== member.tournament_register.toString()){
            console.log("Member ini belum terdaftar di tournament yang sama")
            res.status(400).json({ message: "Member ini belum terdaftar di tournament yang sama" });
          } else {
          member.teams = leader.teams;
          member.save();
          res.status(200).json({ message: "member terdaftar", member: member });
          }
        }).catch(next);
      }
    }).catch(next);
  }

}

module.exports = pesertaController;
