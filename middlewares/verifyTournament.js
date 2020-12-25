const { Error } = require("mongoose");
const District = require("../models/District.model");
const Game = require("../models/Game.model");
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
      
        Tournament.find({ districts: result.districts._id })
          // Tournament.find({districts: result.districts._id, game: req.body.game})
          .populate("districts")
          .populate("game")
          .then((tournament) => {
            console.log("tournament", tournament);
            
            tournament.forEach((val) => {
              const checkGame = req.body.game === val.game.game_name;
              if (checkGame) {
                console.log("game", checkGame);
                 throw new Error('Gagal pokoknya')
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
  static verifyDistrict (req,res){
    const distric = req.userDistrict
    const _id = req.userId
    const {tournament_name, total_participant, age_minimum, description, categories, permalink, game} = req.body 
    const tournament = new Tournament({  
      tournament_name:tournament_name, 
      total_participant:total_participant, 
      age_minimum:age_minimum, 
      description:description, 
      categories:categories, 
      permalink:permalink, 
      game:game,
      image: req.file.originalname,
      districts: distric._id
    })
    Tournament.find({$and:[{districts:distric._id},{tournament_name:tournament_name}]}).then(data=>{
      if(data.length == 0){
         tournament.save().then(result=>{
           res.send({
             success: true,
             message : "berhasil"
           })
         })
      } else {
        Tournament.find({$and:[{districts:distric._id},{game:game}]}).then(game =>{
          if(game.length == 0){
            tournament.save().then(result=>{
              res.send({
                success: true,
                message : "berhasil"
              })
            })
          }else{
            res.send({
              success: false,
              message : "Sudah ada"
            })
          }
        })
      }
    })
  }
}

module.exports = verifyTournament;
