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
routes.use(authJwt.verifyToken);
routes.get('/image/:tournamentId', tournamentController.viewImageTournament);
routes.get("/detail/:tournamentId", tournamentController.detailTournament);
routes.get("/all", tournamentController.tournamentAll);


module.exports = routes;