const { Error } = require("mongoose");
const Tournament = require("../models/Tournament.model");
const User = require("../models/User.model");

class verifyTournament {
  //create tournament -> check district jakarta -> check duplicate tournament

  static checkDistrict(req, res, next) {
    User.findById(req.userId)
      .populate("districts")
      .then((result) => {
        Tournament.find({ districts: result.districts._id })
          .populate("districts")
          .populate("game")
          .then((tournament) => {
            console.log("tournament", tournament);

            tournament.forEach((val) => {
              const checkGame = req.body.game === val.game.game_name;
              if (checkGame) {
                console.log("game", checkGame);
                throw new Error("Gagal pokoknya");
              }
              next();
            });
          })
          .catch(err);
      })
      .catch((err) => {});
  }


  static checkDistrictandTournament(req, res, next) {
    User.findById(req.userId)
      .populate("districts")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        } else if (user) {
          User.find({ districts: user.districts.districts_name })
            .populate("districts")
            .then((result) => {
              Tournament.findOne({ game: req.body.game })
                .populate("districts")
                .then((tournament) => {
                  if (result._id && tournament.districts.districts_name) {
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

  static verifyDistrict(req, res, next) {
    
  }
}

module.exports = verifyTournament;
