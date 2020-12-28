const routes = require ("express").Router();
const tournamentController = require ("../controllers/tournament.controller");
const authJwt = require ("../middlewares/authJwt");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});
// routes.use(authJwt.verifyToken);
routes.get('/image/:tournamentId', tournamentController.viewImageTournament);
routes.get("/detail/:permalink", tournamentController.detailTournament);
routes.get("/filter-game/:gameF", tournamentController.filterGame);
routes.get("/filter-district/:districtsF", tournamentController.filterDistricts);
routes.get("/all", tournamentController.getTournamentAll);
routes.get("/pending", tournamentController.filterTournamentPending);
routes.get("/ongoing", tournamentController.filterTournamentOngoing);
routes.get("/completed", tournamentController.filterTournamentCompleted);


module.exports = routes;