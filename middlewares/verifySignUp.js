const User = require("../models/User.model");

class verifySignUp {
  static checkDuplicate(req, res, next) {
    User.find()
    .then(userfind => {
      for (const i in userfind) {
        if(userfind[i].username == req.body.username){
          res.status(400).json({ message: "Pendaftaran gagal karena username telah digunakan" });
          return;
        }
        if(userfind[i].email == req.body.email){
          res.status(400).json({ message: "Pendaftaran gagal, gunakan Email Lainnya" });
          return;
        }
        if(userfind[i].phone == req.body.phone){
          res.status(400).json({ message: "Nomor Telepon telah terdaftar" });
          return;
        }
      }
      next();
    })
    .catch(next);
  }
}

module.exports = verifySignUp;
