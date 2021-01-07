const User = require("../models/User.model");
const Role = require("../models/Role.model");
const District = require("../models/District.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const lodash = require("lodash");
const DOMAIN = "sandbox30ff1231bb0248ac99c6d3feaf83fada.mailgun.org";
const mg = mailgun({
  apiKey: "d88777eb6d99390072c1be7c1368784d-3d0809fb-c2ae8f0f",
  domain: DOMAIN,
});
const {limiterConsecutiveFailsByUsername,maxConsecutiveFailsByUsername} = require('../configs/mongoconn')

// const bruteforce = require ("bruteforce");

class authController {
  static signUpPeserta(req, res, next) {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      role_name: "peserta",
      old_password: "",
    });
    // const token = jwt.sign({username: req.body.username,  email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)}, "Assignment4", {expiresIn:"20m"});
    // const data = {
    //     from: 'noreply@tournament.com',
    //     to: req.body.email,
    //     subject: 'Email Authenthication',
    //     html: `
    //         <h2>Silahkan klik link berikut ini untuk mengaktifkan akun anda</h2>
    //         <p>http://localhost:8080/auth/activate/${token}</p>
    //     `
    // };
    // mg.messages().send(data, function (error, body) {
    //     if(error){
    //         return res.json({message:error})
    //     }
    // });
    // var districtss,roless
    var districtss;
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // if(req.body.role_name && req.body.districts){
      // User.findOne({role_name: "peserta"})
      // .then(user=>{
      //     user.role_name = "peserta";
      //     // roless = role.role_name;
      // });
      District.findOne({ district_name: req.body.districts })
        .then((district) => {
          console.log(district);
          user.districts = district._id;
          districtss = district.district_name;
          user.save().then((userss) => {
            userss.districts = districtss;
            // userss.roles[0] = roless
            // console.log(userss.roles);
            res
              .status(201)
              .json({ message: "Peserta Berhasil mendaftar", userss });
          });
        })
        .catch(next);
      // }
    });
  }

  static activatePeserta(req, res) {
    const { token } = req.params;
    if (token) {
      jwt.verify(token, "Assignment4", function (err, decodedToken) {
        if (err) {
          return res
            .status(400)
            .json({ message: "Link salah atau sudah kadaluarsa" });
        }
        res
          .status(200)
          .json({ message: "Akun berhasil diaktivasi", decodedToken });
      });
    } else {
      return res.json({ message: "Upps maaf sedang ada masalah nih" });
    }
  }

  static async test(req, res,next){
    async function loginRoute(req, res) {
      const username = req.body.username;
      console.log(username);
      const rlResUsername = await limiterConsecutiveFailsByUsername.get(username);
      console.log(rlResUsername)
    
      if (rlResUsername !== null && rlResUsername.consumedPoints > maxConsecutiveFailsByUsername) {
      const retrySecs = Math.round(rlResUsername.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(retrySecs));
      res.status(429).send('Too Many Requests');
      } else {
        const user = await User.findOne({ username: req.body.username }).populate("districts")
        if (user === null) {
          try {
            await limiterConsecutiveFailsByUsername.consume(username);
            res.status(400).end('username or password is wrong');
            return
          } catch (rlRejected) {
            if (rlRejected instanceof Error) {
              throw rlRejected;
            } else {
              res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
              res.status(429).send('Too Many Requests');
              return
            }
          }
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          try {
            await limiterConsecutiveFailsByUsername.consume(username);
            res.status(400).end('username or password is wrong');
            return
          } catch (rlRejected) {
            if (rlRejected instanceof Error) {
              throw rlRejected;
            } else {
              res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
              res.status(429).send('Too Many Requests');
              return
            }
          }
        }
        var token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            teams: user.teams,
            roles: user.role_name,
            birthdate: user.birthdate,
            districts: user.districts,
            password: user.password,
          },
          "Assignment4",
          {
            expiresIn: 86400,
          }
        );
        // var authorities = [];
        // console.log(user)
        var districts = user.districts.district_name;
        if (rlResUsername !== null && rlResUsername.consumedPoints > 0) {
          // Reset on successful authorisation
        await limiterConsecutiveFailsByUsername.delete(username);
      }
        res.status(200).json({
          id: user._id,
          username: user.username,
          email: user.email,
          birthdate: user.birthdate,
          phone: user.phone,
          roles: user.role_name,
          access_token: token,
          districts: districts,
        });
      };
    }
    try {
      await loginRoute(req, res);
    } catch (err) {
      console.log(err)
      res.status(500).end();
    }
  }
  

  static signIn(req, res) {
    User.findOne({ username: req.body.username })
      .populate("districts")
      .exec((err, user) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        if (user === null) {
          return res.status(401).json({
            access_token: null,
            message: "Kombinasi username dan password tidak ditemukan",
          });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            access_token: null,
            message: "Kombinasi username dan password tidak ditemukan",
          });
        }
        var token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            teams: user.teams,
            roles: user.role_name,
            birthdate: user.birthdate,
            districts: user.districts
          },
          "Assignment4",
          {
            expiresIn: 86400,
          }
        );
        // var authorities = [];
        // console.log(user)
        var districts = user.districts.district_name;

        // for (let i = 0; i < user.roles.length; i++) {
        //   for (let j = 0; j < user.districts.length; j++) {
        //     districts.push(user.districts[j].district_name);
        //   }
        //   authorities.push(user.roles[i].role_name);
        // }

        res.status(200).json({
          id: user._id,
          username: user.username,
          email: user.email,
          birthdate: user.birthdate,
          phone: user.phone,
          roles: user.role_name,
          access_token: token,
          districts: districts,
        });
      });
  }

  static getUserId(req, res, next) {
    console.log(req.userId);
    User.findById(req.userId)
      .populate("districts")
      .then((result) => {
        console.log(result);
        res
          .status(200)
          .json({ message: "Berhasil mendapatkan data user", data: result });
      })
      .catch(next);
  }

  static forgotPassword(req, res) {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
      if (!user) {
        return res.status(400).json({ message: "Pengguna tidak ditemukan" });
      }
      const token = jwt.sign({ _id: user._id }, "Assignment4", {
        expiresIn: "20m",
      });
      const data = {
        from: "noreply@tournament.com",
        to: req.body.email,
        subject: "Password Reset",
        html: `
                    <h2>Silahkan klik link berikut ini untuk mereset password anda</h2>
                    <p>http://localhost:4200/forgot/resetPass/${token}</p>
                `,
      };

      return user.updateOne({ old_password: token }, function (err, success) {
        if (err) {
          return res
            .status(400)
            .json({ message: "link reset password tidak bisa digunakan" });
        } else {
          mg.messages().send(data, function (error, body) {
            if (error) {
              return res.json({ message: error });
            }
            return res.json({
              message:
                "Link reset password telah dikirimkan ke email anda, silahkan ikuti langkah-langkahnya",
              success,
            });
          });
        }
      });
    });
  }

  static resetPassword(req, res) {
    const { old_password } = req.params;
    const { password } = req.body;
    if (old_password) {
      jwt.verify(old_password, "Assignment4", function (error, decodedData) {
        if (error) {
          return res
            .status(401)
            .json({ message: "Token salah atau telah kadaluarsa" });
        }
        User.findOne({ old_password }, (err, user) => {
          if (!user) {
            return res
              .status(400)
              .json({ message: "Pengguna dengan token ini tidak ditemukan" });
          }
          const obj = {
            password: bcrypt.hashSync(password,8),
            old_password: "",
          };

          user = lodash.extend(user, obj);
          user.save((err, user) => {
            if (err) {
              return res.status(400).json({ message: "reset password error" });
            } else {
              return res.status(200).json({
                message: "password berhasil diganti",
                id: user._id,
                username: user.username,
                email: user.email,
                password: bcrypt.hashSync(user.password, 8),
              });
            }
          });
        });
      });
    } else {
      return res.status(401).json({ message: "Error Authenthication" });
    }
  }
}

module.exports = authController;
