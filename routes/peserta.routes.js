const routes = require ("express").Router();
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
routes.put("/update", pesertaController.updatePeserta);
routes.put("/update-password", pesertaController.changePassword);
routes.get("/get/:userId", pesertaController.getPesertaId);
routes.post("/create-team", pesertaController.createTeam);
routes.put("/register-tournament/:permalink", pesertaController.pesertaRegisterTournament);
routes.put('/add-member', pesertaController.pesertaRegisterOtherPesertaToTeam);

routes.get("/getTeamPeserta", pesertaController.getTeamPeserta);

module.exports = routes;
