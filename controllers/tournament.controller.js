const Tournament = require ("../models/Tournament.model");


class tournamentController {
    static viewImageTournament (req,res,next){
        const {tournamentId} = req.params;
        Tournament.findById(tournamentId)
        .then((tournament)=>{
            console.log(tournament.image);
            if(tournament.image){
                res.set('Content-Type', tournament.image.contentType)
                return res.send(tournament.image)
            }
        })
        .catch(next);
    }

    static detailTournament (req,res,next){
       const {permalink} = req.params;
       Tournament.findOne({permalink: permalink})
       .then((tournament)=>{
           res.status(200).json({message:"Berhasil mendapatkan detail tournament", tournament})
       })
       .catch(next);
    }

    static async tournamentAll (req,res,next){
        console.log("coba");
        const {page = 1, limit = 10, q = ''} = req.query;
        try {
            const tournament = await Tournament.find({ tournament_name: { '$regex': q, '$options': 'i' } })
                .sort({tournament_name:1})
                .populate("districts")
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()
            console.log(tournament);
            const nextpage = parseInt(page) + parseInt('1')
            const previouspage = parseInt(page) - parseInt('1')
            const jumlahData = await Tournament.countDocuments({ tournament_name: { '$regex': q, '$options': 'i' } })
            const jumlahPage = Math.ceil(jumlahData / limit)
            var npg, ppg
            if(parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1){
                npg = null
                ppg = null
            } else if(parseInt(page) === parseInt(jumlahPage)){
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
                npg = null
            } else if(parseInt(page) === 1){
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = null
            } else {
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
            }
            res.status(200).json({tournament, page:page, totalpage:jumlahPage, nextpages:npg, previouspages:ppg});
        }
        catch(error){console.log(error.message)}
    }

    static filterGame(req,res,next){
        const {gameF} = req.params;
        console.log("gameF",gameF)
        Tournament.find({game:gameF})
        .then((result)=>{
            console.log(result)
            res.status(200).json({message:result})
        })
        .catch(next)
    }

    static filterDistricts(req,res,next){
        const { districtsF } = req.params;
        console.log("districtsF", typeof(districtsF))
        Tournament.find({districts:districtsF})
        .populate("districts")
        .then((result)=>{
            console.log(result)
            res.status(200).json({message:result})
        })
        .catch(next)
    }

    static async filterTournamentPending(req,res,next){
        console.log("coba");
        const {page = 1, limit = 10, q = ''} = req.query;
        try {
            const tournament = await Tournament.find({is_started: "pending"})
                .sort({tournament_name:1})
                .$where('this.register_total_participant < this.max_total_participant')
                .populate("districts")
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()
                
            console.log(tournament);
            const nextpage = parseInt(page) + parseInt('1')
            const previouspage = parseInt(page) - parseInt('1')
            const jumlahData = await Tournament.countDocuments({ tournament_name: { '$regex': q, '$options': 'i' } })
            const jumlahPage = Math.ceil(jumlahData / limit)
            var npg, ppg
            if(parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1){
                npg = null
                ppg = null
            } else if(parseInt(page) === parseInt(jumlahPage)){
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
                npg = null
            } else if(parseInt(page) === 1){
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = null
            } else {
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
            }
            res.status(200).json({tournament, page:page, totalpage:jumlahPage, nextpages:npg, previouspages:ppg});
        }
        catch(error){console.log(error.message)}
    }

    static async filterTournamentOngoing(req,res,next){
        console.log("coba");
        const {page = 1, limit = 10, q = ''} = req.query;
        try {
            const tournament = await Tournament.find({is_started: "ongoing"})
                .sort({tournament_name:1})
                .populate("districts")
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()
            console.log(tournament);
            const nextpage = parseInt(page) + parseInt('1')
            const previouspage = parseInt(page) - parseInt('1')
            const jumlahData = await Tournament.countDocuments({ tournament_name: { '$regex': q, '$options': 'i' } })
            const jumlahPage = Math.ceil(jumlahData / limit)
            var npg, ppg
            if(parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1){
                npg = null
                ppg = null
            } else if(parseInt(page) === parseInt(jumlahPage)){
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
                npg = null
            } else if(parseInt(page) === 1){
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = null
            } else {
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
            }
            res.status(200).json({tournament, page:page, totalpage:jumlahPage, nextpages:npg, previouspages:ppg});
        }
        catch(error){console.log(error.message)}
    }

    static async filterTournamentCompleted(req,res,next){
        console.log("coba");
        const {page = 1, limit = 10, q = ''} = req.query;
        try {
            const tournament = await Tournament.find({is_started: "completed"})
                .sort({tournament_name:1})
                .populate("districts")
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()
            console.log(tournament);
            const nextpage = parseInt(page) + parseInt('1')
            const previouspage = parseInt(page) - parseInt('1')
            const jumlahData = await Tournament.countDocuments({ tournament_name: { '$regex': q, '$options': 'i' } })
            const jumlahPage = Math.ceil(jumlahData / limit)
            var npg, ppg
            if(parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1){
                npg = null
                ppg = null
            } else if(parseInt(page) === parseInt(jumlahPage)){
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
                npg = null
            } else if(parseInt(page) === 1){
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = null
            } else {
                npg = 'http://localhost:8080/tournament/all?page=' + nextpage
                ppg = 'http://localhost:8080/tournament/all?page=' + previouspage
            }
            res.status(200).json({tournament, page:page, totalpage:jumlahPage, nextpages:npg, previouspages:ppg});
        }
        catch(error){console.log(error.message)}
    }

}

module.exports = tournamentController;