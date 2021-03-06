const User = require("../models/User.model");
const Tournament = require("../models/Tournament.model");
const Team = require("../models/Team.model");
const Game = require("../models/Game.model");
const Match = require("../models/Match.model");

class panitiaController {
  static updatePanitia(req, res, next) {
    const userId = req.userId;
    const {
      username,
      email,
      birthdate,
      phone
    } = req.body;
    const updatedData = {
      username,
      email,
      birthdate,
      phone
    };
    for (let key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }
    User.findByIdAndUpdate(userId, updatedData, {
        new: true
      })
      .then((panitia) => {
        res
          .status(200)
          .json({
            message: "Berhasil mengupdate data panitia",
            updated: panitia,
          });
      })
      .catch(next);
  }

  static getPanitiaId(req, res, next) {
    const {
      userId
    } = req.params;
    User.findById(userId)
      .populate("Roles")
      .populate("districts")
      .then((result) => {
        res
          .status(200)
          .json({
            message: "Berhasil mendapatkan data panitia",
            data: result
          });
      })
      .catch(next);
  }

  static getDataPesertaRegistered(req, res, next) {
    User.find({
        role_name: "peserta",
        districts: req.userDistrict
      })
      .populate("roles")
      .populate("districts")
      .populate("tournament_approved")
      .populate("teams")
      .populate("tournament_register")
      .then((result) => {
        res.status(200).json({
          message: "Berhasil mendapatkan list semua peserta",
          data: result,
        });
      })
      .catch(next);
  }

  static async createGame(req, res, next) {
    const games = await Game.findOne({game_name: req.body.game_name})
    if (games){
      if (games.game_name){
        res.status(400).send({message:'Game sudah dibuat'})
        return
      }
      if (games.game_name == null) {
        res.status(400).send({
          message: 'isi nama game terlebih dahulu'
        })
        return
      }
    } else if(!games) {
      Game.create({game_name: req.body.game_name})
        .then((game) => {
          res.status(201).json({message: "game berhasil ditambahkan",game});
        })
        .catch(next)
    } else {
      throw next;
    }
  }

  static async createTournament(req, res, next) {
    const userId = req.userId
    const district = req.userDistrict;
    const url = req.protocol + "://" + req.get("host");
    const {
      tournament_name,
      max_total_participant,
      age_minimum,
      description,
      categories,
      permalink,
      first_prize,
      second_prize,
      third_prize,
      game,
    } = req.body;
    const tournament = new Tournament({
      id_user_panitia: req.userId,
      tournament_name: tournament_name,
      register_total_participant: 0,
      max_total_participant: max_total_participant,
      age_minimum: age_minimum,
      description: description,
      categories: categories,
      first_prize: first_prize,
      second_prize: second_prize,
      third_prize: third_prize,
      permalink: permalink,
      game: game,
      image: url + "/image/" + req.file.filename,
      districts: district._id,
      is_started: "pending",
    });

    const lomba = await Tournament.find({$and: [{districts: district._id}, {tournament_name: tournament_name}]})
    const permalinks = await Tournament.findOne({permalink:permalink})
    const panitia = await Tournament.find({$and:[{id_user_panitia:userId},{game:game}]})
    const games = await Tournament.find({$and: [{districts: district._id}, {game: game}] })
    
    if (lomba.length !== 0) {
      res.status(400).send({message:"sudah ada perlombaan dengan nama ini"})
    } else if(lomba.length == 0){
      if(permalinks){
        res.status(400).send({message:"Permalink telah digunakan"})
      } else if(games.length !== 0){
        if(panitia.length == 0){
          console.log("wah");
          res.status(400).send({message:"Tidak boleh ada duplikasi tipe game di 1 distrik !"})
        } else if (panitia.length !== 0){
          console.log("wih");
          tournament.save().then((result) => {
            res.status(200).json({ message: result });
          });
        }
        else {
          res.status(500).json({ message: "error" });
        }
      } else if(games.length == 0){
        tournament.save().then((result) => {
          res.status(200).json({ message: "berhasil" });
        });
      } else {
        res.status(500).json({ message: "error" });
      }
    } else {
      res.status(500).json({ message: "error" });
    }
  }

  static getGameCategory(req, res, next) {
    let gameCategory;
    Tournament.findOne({
      id_user_panitia: req.userId
    }).then((user) => {
      gameCategory = user.game;
      Game.findOne({
          game_name: gameCategory
        })
        .then((game) => {
          res.status(200).json({
            message: "bisa",
          });
        })
        .catch(next);
    });
  }

  static findTournamentBasedOnGame(req, res, next) {
    const {
      game
    } = req.params;
    Tournament.find({
        game
      })
      .then((game) => {
        if (game.length == 0) {
          res.status(400).json({
            message: "Game not Found!"
          });
        } else {
          res.status(200).json({
            message: "Game Found!",
            game: game
          });
        }
      })
      .catch(next);
  }

  static findTournamentBasedOnId(req, res, next) {
    const {
      tournamentId
    } = req.params;
    Tournament.findById(tournamentId)
      .then((tournament) => {
        if (tournament.length == 0) {
          res.status(400).json({
            message: "Game not Found!"
          });
        } else {
          res
            .status(200)
            .json({
              message: "Game Found!",
              tournament: tournament
            });
        }
      })
      .catch(next);
  }

  static updateTournament(req, res, next) {
    const {
      tournamentId
    } = req.params;
    const {
      max_total_participant,
      age_minimum,
      categories,
      description,
      first_prize,
      second_prize,
      third_prize,
      first_winner,
      second_winner,
      third_winner,
    } = req.body;
    const updatedData = {
      description,
      max_total_participant,
      age_minimum,
      categories,
      first_prize,
      second_prize,
      third_prize,
      first_winner,
      second_winner,
      third_winner,
    };
    for (let key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }

    Tournament.findByIdAndUpdate(tournamentId, updatedData, {
        new: true
      })
      .then((tournament) => {
        res
          .status(200)
          .json({
            message: "Berhasil mengupdate tournament",
            tournament
          });
      })
      .catch(next);
  }

  static changeTournamentStatusOngoing(req, res, next) {
    const {
      tournamentId
    } = req.params;
    Tournament.findByIdAndUpdate(
        tournamentId, {
          is_started: "ongoing"
        }, {
          new: true
        }
      )
      .then(tournament => {
        // // if user not approved.. still can changes other tournament.
        // User.find({districts: tournament.districts.toString(), tournament_register: tournament.tournament_register, tournament_approved: null})
        // .then(user => {
        //   for (const i in user) {
        //     user[i].tournament_register == null;
        //   }
        //   user.save();
        // })
        // .catch(next);
        res.status(200).json({
          message: "Berhasil mengupdate status turnamen",
          tournament
        });
      })
      .catch(next);
  }

  static changeTournamentStatusCompleted(req, res, next) {
    const {
      tournamentId
    } = req.params;
    Tournament.findByIdAndUpdate(
        tournamentId, {
          is_started: "completed"
        }, {
          new: true
        }
      )
      .then((tournament) => {
        res
          .status(200)
          .json({
            message: "Berhasil mengupdate status turnamen",
            tournament
          });
      })
      .catch(next);
  }

  static changeToApproved(req, res, next) {
    const {
      userId
    } = req.params;
    User.findById(userId)
      .populate("tournament_approved")
      .then((user) => {
        if (user.teams == null) {
          res.status(400).json({
            message: "user belum terdapat dalam Team!"
          });
        } else if (user.tournament_register == null) {
          res
            .status(400)
            .json({
              message: "user belum melakukan registrasi tournament!"
            });
        } else {
          user.tournament_approved = user.tournament_register;
          user.save();
          User.find({
              teams: user.teams
            })
            .then((member) => {
              for (let i = 0; i < member.length; i++) {
                member[i].tournament_approved = user.tournament_register;
                member[i].save();
              }
            })
            .catch(next);
          const match = new Match({
            tournament: user.tournament_approved,
            team: user.teams,
          });
          match.save();
          res
            .status(200)
            .json({
              message: "Berhasil mengupdate status menjadi Approved",
              user,
            });
        }
      })
      .catch(next);
  }

  static getTheMatch(req, res, next) {
    Match.find({
        tournament: req.params.tournamentId
      })
      .populate("tournament")
      .populate("team")
      .then((match) => {
        if (match.length == 0) {
          res.status(400).json({
            message: "Nobody registered!"
          });
        } else {
          res.status(200).json({
            match,
          });
        }
      });
  }

  static getTheTeamMatch(req, res, next) {
    Match.find({
        tournament: req.params.tournamentId,
        match_round: req.params.matchRound,
      })
      .populate("tournament")
      .populate("team")
      .then((match) => {
        if (match.length == 0) {
          res.status(400).json({
            message: "Nobody registered!"
          });
        } else {
          res.status(200).json({
            match,
          });
        }
      });
  }

  static inputScoreMatch(req, res, next) {
    const {
      team,
      score,
      match_round
    } = req.body;
    Match.findOne({
        team: team,
        match_round: match_round
      })
      .populate("tournament")
      .populate("team")
      .then((user) => {
        if (user.score == null) {
          res.status(400).json({
            message: "input user score!"
          });
        } else {
          user.score = score;
          user.save();
          res.status(200).json({
            message: "Score updated!"
          });
        }
      })
      .catch(next);
  }

  static changeStatusEliminateTeam(req, res, next) {
    const {
      team
    } = req.body;
    Match.findOne({
        team: team
      })
      .populate("tournament")
      .populate("team")
      .then((user) => {
        if (user.isEliminate == 0) {
          user.isEliminate = 1;
          user.save();
          res.status(200).json({
            message: "status eliminated True!"
          });
        } else {
          user.isEliminate = 0;
          user.save();
          res.status(200).json({
            message: "status eliminated False!"
          });
        }
      })
      .catch(next);
  }

  static checkThirdWinnerMatch(req, res, next) {
    const {
      tournamentId
    } = req.params;
    const {
      match_round
    } = req.body;
    Match.find({
      tournament: tournamentId,
      match_round: match_round - 1,
      isEliminate: true,
    }).then((match) => {
      for (let i = 0; i < match.length; i++) {
        Match.create({
          tournament: tournamentId,
          team: match[i].team,
          match_round: (match[i].match_round += 1),
          isEliminate: true,
        });
      }
      res.status(200).json(match);
    }).catch;
  }

  static checkEliminate(req, res, next) {
    const {
      tournamentId
    } = req.params;
    const {
      match_round
    } = req.body;
    Match.find({
        tournament: tournamentId,
        match_round: match_round
      })
      .then((match) => {
        if (match.length <= 2) {
          res.status(204).json({
            message: "this is the last Match"
          });
          return;
        } else {
          for (let i = 0; i <= match.length; i += 2) {
            if (match[i] == match[match.length]) {
              Tournament.findById(tournamentId)
                .then((tournament) => {
                  tournament.match_round += 1;
                  console.log("tournament.match_round", tournament.match_round);
                  tournament.save();
                })
                .catch(next);
            } else if (match[i] == match[match.length - 1]) {
              Match.create({
                tournament: tournamentId,
                team: match[i].team,
                match_round: (match[i].match_round += 1),
              });
            } else {
              if (match[i].score > match[i + 1].score) {
                Match.create({
                  tournament: tournamentId,
                  team: match[i].team,
                  match_round: (match[i].match_round += 1),
                });
                match[i + 1].isEliminate = 1;
                match[i + 1].save();
              } else {
                Match.create({
                  tournament: tournamentId,
                  team: match[i + 1].team,
                  match_round: (match[i + 1].match_round += 1),
                });
                match[i].isEliminate = 1;
                match[i].save();
              }
            }
          }
        }

        Tournament.findById(tournamentId)
          .then((tournament) => {
            tournament.match_round += 1;
            console.log("tournament.match_round", tournament.match_round);
            tournament.save();
          })
          .catch(next);
        res.status(200).json({
          message: "eliminate updated"
        });
      })
      .catch(next);
  }

  static async tournamentAllDistrict(req, res, next) {
    console.log("coba");
    const {
      page = 1, limit = 10, q = ""
    } = req.query;
    const url_local = "http://localhost:8080";
    try {
      const tournament = await Tournament.find({
          tournament_name: {
            $regex: q,
            $options: "i"
          },
          districts: req.userDistrict,
        })
        .sort({
          tournament_name: 1
        })
        .populate("districts")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      console.log(tournament);
      const nextpage = parseInt(page) + parseInt("1");
      const previouspage = parseInt(page) - parseInt("1");
      const jumlahData = await Tournament.countDocuments({
        tournament_name: {
          $regex: q,
          $options: "i"
        },
      });
      const jumlahPage = Math.ceil(jumlahData / limit);
      var npg, ppg;
      if (parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1) {
        npg = null;
        ppg = null;
      } else if (parseInt(page) === parseInt(jumlahPage)) {
        ppg = url_local + "/tournament/all?page=" + previouspage;
        npg = null;
      } else if (parseInt(page) === 1) {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = null;
      } else {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = url_local + "/tournament/all?page=" + previouspage;
      }
      res
        .status(200)
        .json({
          tournament,
          page: page,
          totalpage: jumlahPage,
          nextpages: npg,
          previouspages: ppg,
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  static async tournamentAllDistrictOngoing(req, res, next) {
    console.log("coba");
    const {
      page = 1, limit = 10, q = ""
    } = req.query;
    const url_local = "http://localhost:8080";
    try {
      const tournament = await Tournament.find({
          tournament_name: {
            $regex: q,
            $options: "i"
          },
          districts: req.userDistrict,
          is_started: "ongoing",
        })
        .sort({
          tournament_name: 1
        })
        .populate("districts")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      console.log(tournament);
      const nextpage = parseInt(page) + parseInt("1");
      const previouspage = parseInt(page) - parseInt("1");
      const jumlahData = await Tournament.countDocuments({
        tournament_name: {
          $regex: q,
          $options: "i"
        },
      });
      const jumlahPage = Math.ceil(jumlahData / limit);
      var npg, ppg;
      if (parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1) {
        npg = null;
        ppg = null;
      } else if (parseInt(page) === parseInt(jumlahPage)) {
        ppg = url_local + "/tournament/all?page=" + previouspage;
        npg = null;
      } else if (parseInt(page) === 1) {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = null;
      } else {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = url_local + "/tournament/all?page=" + previouspage;
      }
      res
        .status(200)
        .json({
          tournament,
          page: page,
          totalpage: jumlahPage,
          nextpages: npg,
          previouspages: ppg,
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  static createWinners(req, res, next) {
    const {
      tournamentId
    } = req.params;
    const {
      first_winner,
      second_winner,
      third_winner
    } = req.body;

    if (first_winner && second_winner && third_winner) {
      Team.findOne({
        team_name: {
          $in: first_winner
        }
      }).then((first) => {
        Tournament.findByIdAndUpdate(tournamentId, {
          first_winner: first.team_name,
        }).then((first) => {
          console.log(first);
        });
      });
      Team.findOne({
        team_name: {
          $in: second_winner
        }
      }).then((second) => {
        Tournament.findByIdAndUpdate(tournamentId, {
          second_winner: second.team_name,
        }).then((second) => {
          console.log(second);
        });
      });
      Team.findOne({
          team_name: {
            $in: third_winner
          }
        })
        .then((third) => {
          Tournament.findByIdAndUpdate(
            tournamentId, {
              third_winner: third.team_name
            }, {
              upsert: true,
              returnOriginal: false
            }
          ).then((third) => {
            res.status(200).json({
              message: "Berhasil menambahkan pemenang perlombaan",
              third,
            });
          });
        })
        .catch(next);
    }
  }
}

module.exports = panitiaController;
