const { Error } = require("mongoose");
const District = require("../models/District.model");
const Tournament = require("../models/Tournament.model");
const User = require("../models/User.model");

// const express = require("express");
// const formidableMiddleware = require('express-formidable');
// const formidable = require("formidable");

// const app = express();
// app.use(formidableMiddleware());

class verifyTournament {
  //create tournament -> check district jakarta -> check duplicate tournament

  static checkDistrict(req, res, next) {
    User.findById(req.userId)
      .populate("districts")
      .then((result) => {
        //kalau tipe_game udah ada di kelurahan ini brrti ga bisa
        //kalau tipe_game belum ada di kelurahan ini brrti bisa
        // district name yg ada di panitiaOn

        // Tournament.find({districts: result.districts.district_name})

        //tournament.game && tournament.districts
        // console.log(result.districts._id);
        Tournament.find({ districts: result.districts._id })
          // Tournament.find({districts: result.districts._id, game: req.body.game})
          .populate("districts")
          .populate("game")
          .then((tournament) => {
            // console.log("tournament", tournament);
            tournament.forEach((val) => {
              const checkGame = req.body.game === val.game.game_name;
              if (checkGame) {
                return res.status(400).json({notification:"gagal"})
                // throw new Error('Gagal pokoknya')
              }
              next();
            });

            // if(req.userDistrict == tournament.districts){
            //   // a == a
            //   if(tournament.game == req.body.game){
            //     //renang == renang
            //     throw "gabisa"
            //   }else{
            //     //renang !== basket
            //     next();
            //   }
            // } else{
            //   // a !== b
            //   next();
            // }
            // if(tournament.game !== req.body.game){
            //   console.log(tournament.game !== req.body.game)
            //   next();

            // } else if(tournament.game){
            //   throw "gabisa"
            // }else if (tournament.game == req.body.game){
            //   console.log("gak bisa")
            // }

            // else if (tournament.game !== req.body.game){
            //   next();
            // }
          })
          .catch(err);
      })
      .catch((err) => {});
  }

  static checkTipeGame(req, res, next) {}

  static checkDistrictandTournament(req, res, next) {
    // console.log(req.userId);
    console.log(req.body.tournament_name);
    console.log(req.body.game);
    User.findById(req.userId)
      .populate("districts")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        } else if (user) {
          console.log("user", user);
          User.find({ districts: user.districts.districts_name })
            .populate("districts")
            .then((result) => {
              console.log("result", result);
              Tournament.findOne({ game: req.body.game })
                .populate("districts")
                .then((tournament) => {
                  console.log("tournament", tournament);
                  // if(result || tournament){
                  if (result._id && tournament.districts.districts_name) {
                    console.log(`result ${tournament.districts.district_name}`);
                    // console.log("tournament");
                    res.status(400).send({
                      message:
                        "Pendaftaran gagal karena tournament di district ini sudah ada",
                    });
                    return;
                  } else {
                    next();
                  }
                });
            });
        }
      });
  }

  // static checkDuplicateTournament (req, res, next) {
  //   // Username
  //   Tournament.findOne({tournament_name: req.fields.tournament_name})
  //   .exec((err, user) => {
  //     if (err) {
  //       res.status(500).send({ message: err });
  //       return;
  //     }

  //     if (user) {
  //       res.status(400).send({ message: "Pendaftaran gagal karena tournament sudah dibuat" });
  //       return;
  //     }
  //     next();
  //   });
  // }
}

module.exports = verifyTournament;
