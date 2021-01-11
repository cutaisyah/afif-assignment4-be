const routes = require ("express").Router();
const adminController = require ("../controllers/admin.controller");
const authJwt = require("../middlewares/authJwt");
const verifySignUp = require ("../middlewares/verifySignUp");

routes.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "access_token, Origin, Content-Type, Accept"
    );
    next();
});
routes.post("/signup", verifySignUp.checkDuplicate, adminController.signUpAdmin);
routes.use(authJwt.verifyToken, authJwt.isAdmin);
routes.put("/update", adminController.updateAdmin);
routes.get("/get/:userId", adminController.getAdminId);
routes.post("/create-lurah", verifySignUp.checkDuplicate, adminController.createLurah);
routes.post("/create-district", adminController.createDistrict);
routes.get("/data-lurah", adminController.dataLurah);
routes.post("/data-user-filter", adminController.filterDataUser);
routes.get("/data-district", adminController.dataDistrict);
routes.get("/data-user-all", adminController.dataUserAll);




module.exports = routes;