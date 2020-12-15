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
       const {tournamentId} = req.params;
       Tournament.findById(tournamentId)
       .then((tournament)=>{
           res.status(200).json({message:"Berhasil mendapatkan detail tournament", tournament})
       })
       .catch(next);
    }

    static async tournamentAll (req,res,next){
        const {page = 1, limit = 4, q = ''} = req.query;
        try {
            const tournament = await Tournament.find({ tournament_name: { '$regex': q, '$options': 'i' } })
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