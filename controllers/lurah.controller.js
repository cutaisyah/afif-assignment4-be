const User = require("../models/User.model");
const Role = require("../models/Role.model");
const District = require("../models/District.model");
const bcrypt = require("bcrypt");
const Tournament = require("../models/Tournament.model");

class lurahController {
  static updateLurah(req, res, next) {
    const { userId } = req.params;
    const password = bcrypt.hashSync(req.body.password, 8);
    const { username, email, birthdate, phone } = req.body;
    const updatedData = { username, email, password, birthdate, phone };
    for (let key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }
    User.findByIdAndUpdate(userId, updatedData, { new: true })
      .then((lurah) => {
        lurah.old_password = req.userPassword;
        lurah.save();
        res
          .status(200)
          .json({ message: "Berhasil mengupdate data lurah", updated: lurah });
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
    // const {userId} = req.params.userId;
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 6),
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      role_name: "panitia",
      districts: req.userDistrict,
    });
    // var districtss,roless
    var districtss;

    // User.findById(req.userId)
    //         .populate("districts")
    //         .then(user => {
    //             districtss = user.districts.district_name;
    //             console.log(districtss);
    //             user.save().then(userss=>{
    //                 userss.districts = districtss

    //                 // userss.roles[0] = roless
    //                 // console.log(userss.roles);
    //                 res.status(201).json({ message: "Berhasil membuat panitia", userss });
    //             })
    //         }).catch(next);

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // if(req.body.roles && req.body.districts){
      // Role.findOne({role_name: "panitia"})
      // .then(role=>{
      //     user.roles = [role._id];
      //     roless = role.role_name;
      // });

      User.findById(req.userId)
        .populate("districts")
        .then((user) => {
          districtss = user.districts.district_name;
          // console.log(districtss);
          user.save().then((userss) => {
            userss.districts = districtss;
            // userss.roles[0] = roless
            // console.log(userss.roles);
            res
              .status(201)
              .json({ message: "Berhasil membuat panitia", userss });
          });
        })

        // District.findOne({district_name:req.body.districts})
        // .then(district=>{
        //     user.districts = district._id;
        //     districtss = district.district_name;
        //     user.save().then(userss=>{
        //         userss.districts = districtss
        //         // userss.roles[0] = roless
        //         // console.log(userss.roles);
        //         res.status(201).json({ message: "Berhasil membuat panitia", userss });
        //     })
        // })
        .catch(next);
      // }
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

  // static async dataTournamentByDistrict (req,res,next){
  //     const {page = 1, limit = 10, q = ''} = req.query;
  //     const url_local = "http://localhost:8080";
  //     try {
  //         const tournament = await Tournament.find({ tournament_name: { '$regex': q, '$options': 'i' }, districts: req.userDistrict })
  //             .sort({tournament_name:1})
  //             .populate("districts")
  //             .limit(limit * 1)
  //             .skip((page - 1) * limit)
  //             .exec()
  //         console.log(tournament);
  //         const nextpage = parseInt(page) + parseInt('1')
  //         const previouspage = parseInt(page) - parseInt('1')
  //         const jumlahData = await Tournament.countDocuments({ tournament_name: { '$regex': q, '$options': 'i' } })
  //         const jumlahPage = Math.ceil(jumlahData / limit)
  //         var npg, ppg
  //         if(parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1){
  //             npg = null
  //             ppg = null
  //         } else if(parseInt(page) === parseInt(jumlahPage)){
  //             ppg = url_local + '/tournament/all?page=' + previouspage
  //             npg = null
  //         } else if(parseInt(page) === 1){
  //             npg = url_local + '/tournament/all?page=' + nextpage
  //             ppg = null
  //         } else {
  //             npg = url_local + '/tournament/all?page=' + nextpage
  //             ppg = url_local + '/tournament/all?page=' + previouspage
  //         }
  //         res.status(200).json({tournament, page:page, totalpage:jumlahPage, nextpages:npg, previouspages:ppg});
  //     }
  //     catch(error){console.log(error.message)}
  //   }
}

module.exports = lurahController;
