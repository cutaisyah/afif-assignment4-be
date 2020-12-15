const mongoose = require ("mongoose");
const dbConfig = {HOST: "localhost",PORT: 27017, DB: "Database_Assignment4_Tournament"}
const Role = require ("../models/Role.model");
const District = require ("../models/District.model");
const TournamentIsStarted = require ("../models/TournamentIsStarted.model");
const TournamentCategory = require ("../models/TournamentCategory.model");


module.exports = () => {
    mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err=>{
        console.error("Connection error", err);
        process.exit();
    });

    function initial(){
        Role.estimatedDocumentCount((err, count)=>{
            if(!err && count === 0){
                new Role({role_name: "peserta"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database role 'peserta'");
                });
                new Role({role_name: "panitia"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database role 'panitia'");
                });
                new Role({role_name: "lurah"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database role 'lurah'");
                });
                new Role({role_name: "admin"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database role 'admin'");
                });
            }
        });

        District.estimatedDocumentCount((err,count)=>{
            if(!err && count === 0){
                new District({district_name: "jakarta"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database district'jakarta'");
                });
                new District({district_name: "depok"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database district 'depok'");
                });
                new District({district_name: "bekasi"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database district 'bekasi'");
                });
                new District({district_name: "tangerang"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database district 'tangerang'");
                });
            }
        });

        TournamentIsStarted.estimatedDocumentCount((err,count)=>{
            if(!err && count === 0){
                new TournamentIsStarted({condition_name: "pending"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database isStarted 'pending'");
                });
                new TournamentIsStarted({condition_name: "on-going"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database isStarted 'on-going'");
                });
                new TournamentIsStarted({condition_name: "complete"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database isStarted 'complete'");
                });
            }
        });

        TournamentCategory.estimatedDocumentCount((err,count)=>{
            if(!err && count === 0){
                new TournamentCategory({category_name: "single elimination"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database tournament category 'single elimination'");
                });
                new TournamentCategory({category_name: "free for all"})
                .save(err=>{
                    if(err){console.log("error",err);}
                    console.log("Berhasil menambahkan database tournament category 'free for all'");
                });
            }
        })
    }
}