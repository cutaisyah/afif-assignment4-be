const routes = require ("express").Router();
const matchController = require ("../controllers/match.controller");
const authJwt = require ("../middlewares/authJwt");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});

routes.use(authJwt.verifyToken, authJwt.isPanitia);
routes.post("/create-bracket", matchController.createMatch);

module.exports = routes;