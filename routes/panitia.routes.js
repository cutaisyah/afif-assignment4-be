const routes = require ("express").Router();
const panitiaController = require ("../controllers/panitia.controller");
const authJwt = require ("../middlewares/authJwt");
const verifyTournament = require("../middlewares/verifyTournament");

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
routes.post("/create-tournament", verifyTournament.checkDistrictandTournament, panitiaController.createTournament);
routes.put("/edit-tournament", panitiaController.updateTournament);
routes.get("/view-request", panitiaController.viewRequestPeserta);
routes.put("/respon-request/:approvedId", panitiaController.responseRequestPeserta);
routes.post("/create-prizes", panitiaController.createPrizes);
routes.put("/create-winners/:tournamentId", panitiaController.createWinners);




module.exports = routes;