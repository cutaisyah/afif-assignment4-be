const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const Tournament = require("../models/Tournament.model");

class lurahController {
  static updateLurah(req, res, next) {
    const { username, email, birthdate, phone } = req.body;
    const updatedData = { username, email, birthdate, phone };
    for (let key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }
    User.findByIdAndUpdate(req.userId, updatedData, { new: true })
      .then((lurah) => {
        res.status(200).json({ message: "Berhasil mengupdate data lurah", updated: lurah });
      })
      .catch(next);
  }

  static getLurahId(req, res, next) {
    const { userId } = req.params;
    User.findById(userId)
      .populate("districts")
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(next);
  }

  static createPanitia(req, res, next) {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 6),
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      role_name: "panitia",
      districts: req.userDistrict,
    });
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(201).json({ message: "Lurah berhasil dibuat" });
    });
  }

  static dataPanitia(req, res, next) {
    User.find({ role_name: "panitia" })
      .populate("districts")
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(next);
  }

  static dataTournamentByDistrict(req, res, next) {
    Tournament.find({ districts: req.userDistrict })
      .then((tournament) => {
        res.status(200).json(tournament);
      })
      .catch(next);
  }
}

module.exports = lurahController;
