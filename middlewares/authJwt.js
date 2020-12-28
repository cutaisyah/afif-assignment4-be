const jwt = require ("jsonwebtoken");
const Role = require("../models/Role.model");
const User = require ("../models/User.model");


class authJwt {

    static verifyToken (req, res, next) {
        let token = req.headers["access_token"];
    
        if (!token) {return res.status(403).send({ message: "Missing access token" });}
      
        jwt.verify(token, "Assignment4", (err, decoded) => {
          if (err) {return res.status(401).send({ message: "Unauthorized!" });}
          req.userId = decoded.id;
          req.userDistrict = decoded.districts;
          req.userAge = decoded.birthdate;
          next();
        });
    };
    
    static isPanitia (req,res,next) {
        User.findById(req.userId)
        .exec((err,user)=>{
            if (err){
                res.status(500).send({ message: err });
                return;
            }
            User.findOne({role_name:"panitia"}, (err,roles) => {
                if(err){
                    res.status(500).send({ message: err });
                    return;
                }
                // for (let i = 0; i < roles.length; i++){
                    if(roles.role_name === "panitia"){
                        next();
                        return;
                    }
                // }
                res.status(403).send({ message: "Hanya bisa diakses oleh panitia" });
                return;
            });
        });
    };
    
    static isLurah (req,res,next) {
        User.findById(req.userId)
        .exec((err,user)=>{
            if (err){
                res.status(500).send({ message: err });
                return;
            }
            User.findOne({role_name:"lurah"}, (err,roles) => {
                if(err){
                    res.status(500).send({ message: err });
                    return;
                }
                // for (let i = 0; i < roles.length; i++){
                    
                    if(roles.role_name === "lurah"){
                        next();
                        return;
                    }
                // }
                res.status(403).send({ message: "Hanya bisa diakses oleh lurah" });
                return;
            });
        });
    };
    
    static isAdmin (req,res,next) {
        User.findById(req.userId)
        .exec((err,user)=>{
            if (err){
                res.status(500).send({ message: err });
                return;
            }
            User.findOne({role_name:"admin"}, (err,roles) => {
                if(err){
                    res.status(500).send({ message: err });
                    return;
                }
                // for (let i = 0; i < roles.length; i++){
                    if(roles.role_name === "admin"){
                        next();
                        return;
                    }
                // }
                res.status(403).send({ message: "Hanya bisa diakses oleh admin" });
                return;
            });
        });
    };

}
module.exports = authJwt;


   



