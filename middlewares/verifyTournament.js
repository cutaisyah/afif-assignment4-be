const User = require ("../models/User.model");


class verifyTournament{
    static checkDuplicateUsernameOrEmail (req, res, next) {
      // Username
      User.findOne({username: req.body.username})
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (user) {
          res.status(400).send({ message: "Pendaftaran gagal karena username telah digunakan" });
          return;
        }
          // Email
          User.findOne({email: req.body.email})
          .exec((err, user) => {
              if (err) {
                  res.status(500).send({ message: err });
                  return;
              }
    
              if (user) {
                  res.status(400).send({ message: "Pendaftaran gagal karena email telah digunakan" });
                  return;
              }
              next();
          });
      });
    }
}

module.exports = verifyTournament;





  
