const routes = require ("express").Router();
const { teamRegisterTournament } = require("../controllers/peserta.controller");
const pesertaController = require ("../controllers/peserta.controller");
const authJwt = require ("../middlewares/authJwt");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});

routes.use(authJwt.verifyToken);
routes.put("/update/:userId", pesertaController.updatePeserta);
routes.get("/get/:userId", pesertaController.getPesertaId);
routes.post("/create-team", pesertaController.createTeam);
routes.put("/register-team/:userId", pesertaController.registerTeam);
routes.post("/register-tournament/:userId", pesertaController.pesertaRegisterTournament);
routes.post('/team-register-tournament/:teamId', pesertaController.teamRegisterTournament);

module.exports = routes;