const User = require("../models/User.model");
const Role = require("../models/Role.model");
const District = require("../models/District.model");
const bcrypt = require("bcrypt");

class adminController {
  //untuk mnedaftar sbg admin
  static signUpAdmin(req, res, next) {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      role_name: "admin",
    });
    // var districtss, roless;
    var districtss;
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      //   if (req.body.roles && req.body.districts) {
      // Role.findOne({ role_name: "admin" }).then((role) => {
      //   user.roles = [role._id];
      //   roless = role.role_name;
      //   console.log(role);
      // });
      District.findOne({ district_name: req.body.districts })
        .then((district) => {
          console.log(district);
          user.districts = district._id;
          districtss = district.district_name;
          user.save().then((userss) => {
            userss.districts = districtss;
            //   userss.roles[0] = roless;
            res
              .status(201)
              .json({ message: "Anda telah berhasil menjadi admin", userss });
          });
        })
        .catch(next);
      //   }
    });
  }

  static updateAdmin(req, res, next) {
    const { userId } = req.userId;
    const { username, email, birthdate, phone } = req.body;
    const updatedData = { username, email, birthdate, phone };
    for (let key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }
    User.findByIdAndUpdate(userId, updatedData, { new: true })
      .then((user) => {
        res
          .status(200)
          .json({ message: "Berhasil mengupdate data admin", updated: user });
      })
      .catch(next);
  }

  static changePassword(req, res, next) {
    const userId = req.userId;
    let password = bcrypt.hashSync(req.body.password,8);
    let old_password = bcrypt.hashSync(req.body.old_password,8);
    const updatedData = { password, old_password };
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
              result.old_password == result.password;
              result.password == req.body.password;
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

  static getAdminId(req, res, next) {
    const { userId } = req.params;
    User.findById(userId)
      .populate("districts")
      .then((user) => {
        res
          .status(200)
          .json({ message: "Berhasil mendapatkan data admin", data: user });
      })
      .catch(next);
  }

  static createLurah(req, res, next) {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      role_name: "lurah",
    });
    // var districtss,roless
    var districtss;
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      District.findOne({ district_name: req.body.districts })
        .then((district) => {
          user.districts = district._id;
          districtss = district.district_name;
          user.save().then((userss) => {
            userss.districts = districtss;
            res
              .status(201)
              .json({ message: "Anda telah berhasil menjadi lurah", userss });
          });
        })
        .catch(next);
    });
  }

  static createRole(req, res, next) {
    const { role_name } = req.body;
    Role.create({ role_name })
      .then((role) => {
        res.status(201).json({ message: "Role berhasil ditambahkan", role });
      })
      .catch(next);
  }

  static createDistrict(req, res, next) {
    const { district_name } = req.body;
    if(district_name == null){
      res.status(400).json({ message: "isi nama district terlebih dahulu"});
    }else{
      District.create({ district_name })
      .then((district) => {
        res
          .status(201)
          .json({ message: "District berhasil ditambahkan", district });
      })
      .catch(next);
    }
  }

  static dataLurah(req, res, next) {
    User.find({ role_name: "lurah" })
      .populate("roles")
      .sort({ username: 1 }) // ASC : 1 -- DES:-1
      .then((result) => {
        res
          .status(200)
          .json({ message: "Berhasil mendapatkan list semua lurah", result });
      })
      .catch(next);
  }

  static filterDataUser(req, res, next) {
    const { district, role } = req.body;
    console.log(district);
    console.log(role);
    User.find({ $and: [{ districts: district }, { roles: role }] })
      .populate("roles")
      .populate("districts")
      .sort({ username: 1 }) // ASC : 1 -- DES:-1
      .then((result) => {
        res
          .status(200)
          .json({ message: "Berhasil mendapatkan list semua user", result });
      })
      .catch(next);
  }

  static dataRole(req, res, next) {
    Role.find()
      .then((role) => {
        res
          .status(200)
          .json({ message: "Berhasil mendapatkan list semua role", role });
      })
      .catch(next);
  }

  static dataDistrict(req, res, next) {
    District.find()
      .then((district) => {
        res.status(200).json({
          message: "Berhasil mendapatkan list semua district",
          district,
        });
      })
      .catch(next);
  }

  static dataUserAll(req, res, next) {
    User.find()
      .populate("roles")
      .populate("districts")
      .then((user) => {
        res.status(200).json({
          message: "Berhasil mendapatkan list semua pengguna aplikasi",
          user,
        });
      })
      .catch(next);
  }
}

module.exports = adminController;
