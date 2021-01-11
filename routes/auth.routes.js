const routes = require("express").Router();
const authController = require("../controllers/auth.controller");
const authJwt = require("../middlewares/authJwt");
const verifySignUp = require ("../middlewares/verifySignUp");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});

routes.post("/signup", verifySignUp.checkDuplicate, authController.signUpPeserta);
routes.get("/userid", authJwt.verifyToken, authController.getUserId);
routes.post("/test", authController.test);
routes.post("/signin", authController.signIn);
routes.put("/forgot-password", authController.forgotPassword);
routes.put("/reset-password/:reset_link", authController.resetPassword);



module.exports = routes;