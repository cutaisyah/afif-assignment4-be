const routes = require ("express").Router();
const lurahController = require ("../controllers/lurah.controller");
const authJwt = require ("../middlewares/authJwt");
const verifyToken = require ("../middlewares/verifySignUp");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});

routes.use(authJwt.verifyToken, authJwt.isLurah);
routes.put("/update", lurahController.updateLurah);
routes.get("/get/:userId", lurahController.getLurahId);
routes.post("/create-panitia", verifyToken.checkDuplicateUsernameOrEmail, lurahController.createPanitia);
routes.get("/data-panitia", lurahController.dataPanitia);

routes.get("/allbaseondistrict", lurahController.dataTournamentByDistrict);


module.exports = routes;