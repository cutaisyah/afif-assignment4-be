const User = require ("../models/User.model");
const Role = require ("../models/Role.model");
const District = require ("../models/District.model");
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcrypt");
const mailgun = require("mailgun-js");
const lodash = require("lodash");
const DOMAIN = "sandbox0a102922ac694ab3a230ca1f5f3c09cd.mailgun.org";
const mg = mailgun({apiKey: "715cad9ba4a54a9f81b61010ab69dc83-360a0b2c-3f011ff4", domain: DOMAIN});
// const bruteforce = require ("bruteforce");

class authController {
    static signUpPeserta (req,res,next){
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            birthdate: req.body.birthdate,
            phone: req.body.phone
        });
        const token = jwt.sign({username: req.body.username,  email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)}, "Assignment4", {expiresIn:"20m"});
        const data = {
            from: 'noreply@tournament.com',
            to: req.body.email,
            subject: 'Email Authenthication',
            html: `
                <h2>Silahkan klik link berikut ini untuk mengaktifkan akun anda</h2>
                <p>http://localhost:3000/auth/activate/${token}</p>
            `
        };
        mg.messages().send(data, function (error, body) {
            if(error){
                return res.json({message:error})
            }
        });
        var districtss,roless
        user.save((err, user) => {
            if (err) {res.status(500).send({ message: err });return;}
            if(req.body.roles && req.body.districts){
                Role.findOne({role_name: "peserta"})
                .then(role=>{
                    user.roles = [role._id];
                    roless = role.role_name;
                });
                District.findOne({district_name:req.body.districts})
                .then(district=>{
                    user.districts = district._id;
                    districtss = district.district_name;
                    user.save()
                    .then(userss=>{   
                        userss.districts[0] = districtss
                        userss.roles[0] = roless
                        console.log(userss.roles);
                        res.status(201).json({ message: "Peserta Berhasil mendaftar", userss });
                    })
                })
                .catch(next);
            }
        });
    }

    static activatePeserta (req,res){
        const {token} = req.params;
        if(token){
            jwt.verify(token, "Assignment4", function(err, decodedToken){
                if(err){
                    return res.status(400).json({message:"Link salah atau sudah kadaluarsa"})
                }
                res.status(200).json({message:"Akun berhasil diaktivasi", decodedToken});
            })
        }
        else {
            return res.json({message:"Upps maaf sedang ada masalah nih"})
        }
    }

    static signIn (req,res){
        User.findOne({username: req.body.username})
        .populate("roles")
        .populate("districts")
        .exec((err,user)=>{
            if(err){
                res.status(500).json({message:err});
                return;
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if(!passwordIsValid && !user){
                return res.status(401).json({access_token:null, message:"Kombinasi username dan password tidak ditemukan"});
            }
            var token = jwt.sign({id: user.id}, "Assignment4", {expiresIn:86400});
            var authorities = [];
            var districts = [];

            for (let i = 0; i < user.roles.length; i++){
                for(let j = 0; j < user.districts.length; j++){
                    districts.push(user.districts[j].district_name);
                }
                authorities.push(user.roles[i].role_name);
            }

            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                birthdate: user.birthdate,
                phone: user.phone,
                roles: authorities,
                access_token: token,
                districts: districts
            });
        });
    }

    static forgotPassword (req,res){
        const {email} = req.body;
        User.findOne({email}, (err,user)=>{
            if(!user){
                return res.status(400).json({message:"Pengguna tidak ditemukan"})
            }
            const token = jwt.sign({_id:user._id}, "Assignment4", {expiresIn:"20m"});
            const data = {
                from: 'noreply@tournament.com',
                to: req.body.email,
                subject: 'Password Reset',
                html: `
                    <h2>Silahkan klik link berikut ini untuk mereset password anda</h2>
                    <p>http://localhost:3000/auth/resetpassword/${token}</p>
                `
            };

            return user.updateOne({old_password: token}, function (err,success){
                if(err){
                    return res.status(400).json({message:"link reset password tidak bisa digunakan"});
                }
                else {
                    mg.messages().send(data, function (error, body) {
                        if(error){
                            return res.json({message:error})
                        }
                        return res.json({message:"Link reset password telah dikirimkan ke email anda, silahkan ikuti langkah-langkahnya", success})
                    });
                }
            });
            
        });
    }

    static resetPassword(req,res){
        const {old_password} = req.params;
        const {newPassword} = req.body;
        if(old_password){
            jwt.verify(old_password, "Assignment4", function(error,decodedData){
                if(error){
                    return res.status(401).json({message:"Token salah atau telah kadaluarsa"});
                }
                User.findOne({old_password}, (err,user)=>{
                    if(!user){
                        return res.status(400).json({message:"Pengguna dengan token ini tidak ditemukan"})
                    }   
                    const obj = {
                        password: newPassword,
                        old_password: ""
                    }
                    user = lodash.extend(user, obj);
                    user.save((err,user)=>{
                        if(err){
                            return res.status(400).json({message:"reset password error"})
                        }
                        else {
                            return res.status(200).json({
                                message:"password berhasil diganti",
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                password: bcrypt.hashSync(user.password, 8),
                            })
                        }
                    })
                })
            })
        }
        else{
            return res.status(401).json({message:"Error Authenthication"})
        }
    }
}

module.exports = authController;