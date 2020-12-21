const District = require("../models/District.model");
const Tournament = require("../models/Tournament.model");
const User = require ("../models/User.model");

class verifyTournament{

  //create tournament -> check district jakarta -> check duplicate tournament


  
    static checkDistrictandTournament (req, res, next) {
      // console.log(req.userId);
      User.findById(req.userId)
      .populate("districts")
      .exec((err, user) =>{
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        else if (user) {
          // console.log(user);
          User.findOne(user.districts.districts_name)
          .then(result => {
            console.log(result);
            Tournament.findOne({tournament_name: req.body.tournament_name})
            .then( tournament => {
              console.log(req.body.tournament_name)
              if(result && tournament){
                console.log(`result ${result.districts.districts_name}`);
                // console.log("tournament");
                res.status(400).send({ message: "Pendaftaran gagal karena tournament di district ini sudah ada" });
                return;
              }else {
                next();
              }
            })
          })
        }
      })
    }

    static checkDuplicateTournament (req, res, next) {
      // Username
      Tournament.findOne({tournament_name: req.body.tournament_name})
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (user) {
          res.status(400).send({ message: "Pendaftaran gagal karena tournament sudah dibuat" });
          return;
        }
        next();
      });
    }
}

module.exports = verifyTournament;





  
