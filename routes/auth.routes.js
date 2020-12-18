const routes = require ("express").Router();
const authController = require ("../controllers/auth.controller");
const verifySignUp = require ("../middlewares/verifySignUp");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});

routes.post("/signup", verifySignUp.checkDuplicateUsernameOrEmail, authController.signUpPeserta);
routes.get("/activate/:token", authController.activatePeserta);
routes.post("/signin", authController.signIn);
routes.put("/forgot-password", authController.forgotPassword);
routes.put("/reset-password/:old_password", authController.resetPassword);



module.exports = routes;