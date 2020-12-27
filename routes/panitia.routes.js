const routes = require ("express").Router();
const panitiaController = require ("../controllers/panitia.controller");
const authJwt = require ("../middlewares/authJwt");
const verifyTournament = require("../middlewares/verifyTournament");
const extractFile = require("../middlewares/file");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});

routes.use(authJwt.verifyToken, authJwt.isPanitia);
routes.put("/update/:userId", panitiaController.updatePanitia);
routes.get("/get/:userId", panitiaController.getPanitiaId);
routes.get("/data-peserta", panitiaController.dataPeserta);

routes.post("/create-game", panitiaController.createGame);
routes.post("/create-tournament", extractFile, verifyTournament.verifyDistrict, panitiaController.createTournament);

routes.put("/edit-tournament/:tournamentId", panitiaController.updateTournament);
routes.put("/edit-status-tournament-to-ongoing/:tournamentId", panitiaController.changeTournamentStatusOngoing);
routes.put("/edit-status-tournament-to-completed/:tournamentId", panitiaController.changeTournamentStatusCompleted);

routes.get("/get-game", panitiaController.getGameCategory);
routes.get("/findtournamentbyid/:tournamentId", panitiaController.findTournamentBasedOnId);
routes.get("/allbaseondistrict", panitiaController.tournamentAllDistrict);
routes.get("/findtournamentgame/:game", panitiaController.findTournamentBasedOnGame);

routes.get("/view-request", panitiaController.viewRequestPeserta);
routes.put("/respon-request/:approvedId", panitiaController.responseRequestPeserta);
routes.post("/create-prizes", panitiaController.createPrizes);
routes.put("/create-winners/:tournamentId", panitiaController.createWinners);

routes.get("/cekdis", verifyTournament.checkDistrict)




module.exports = routes;