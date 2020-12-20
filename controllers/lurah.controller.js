const User = require ("../models/User.model");
const Role = require ("../models/Role.model");
const District = require ("../models/District.model");
const bcrypt = require ("bcrypt");
const Tournament = require ("../models/Tournament.model");

class lurahController {
    static updateLurah (req,res,next){
        const {userId} = req.params;
        const {username, email, password, birthdate, phone} = req.body;
        const updatedData =  {username, email, password, birthdate, phone}
        for (let key in updatedData){
            if(!updatedData[key]){
              delete updatedData[key]
            }
        }
        User.findByIdAndUpdate(userId, updatedData, {new:true})
        .then((lurah)=>{
            res.status(200).json({message:'Berhasil mengupdate data lurah', updated:lurah});
        })
        .catch(next);
    }

    static getLurahId (req,res,next){
        const {userId} = req.params
        User.findById(userId)
        .populate("Roles")
        .populate("districts")
        .then(result=>{
            res.status(200).json({message:'Berhasil mendapatkan data lurah', data:result});
        })
        .catch(next);
    }

    static createPanitia (req,res, next){
        // const {userId} = req.params.userId;
        const user = new User ({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 6),
            birthdate: req.body.birthdate,
            phone: req.body.phone,
            role_name: "panitia",
            districts: req.userDistrict,
        });
        // var districtss,roless
        var districtss

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

        user.save((err,user)=>{
            if (err) {res.status(500).send({ message: err });return;}
            // if(req.body.roles && req.body.districts){
                // Role.findOne({role_name: "panitia"})
                // .then(role=>{
                //     user.roles = [role._id];
                //     roless = role.role_name;
                // });
                
                User.findById(req.userId)
                .populate("districts")
                .then(user => {
                    districtss = user.districts.district_name;
                    // console.log(districtss);
                    user.save().then(userss=>{   
                        userss.districts = districtss
                        // userss.roles[0] = roless
                        // console.log(userss.roles);
                        res.status(201).json({ message: "Berhasil membuat panitia", userss });
                    })
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

    static dataPanitia (req,res,next){
        User.find({roles:"5fcb009dbb23a6115cc6b3f9"})
        .populate("roles")
        .then(result=>{
            res.status(200).json({message:"Berhasil mendapatkan list semua panitia", data:result});
           
            
        })
        .catch(next);
    }
}

module.exports = lurahController;