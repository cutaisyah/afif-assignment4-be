const routes = require ("express").Router();
const authRoutes = require ("./auth.routes");
const adminRoutes = require ("./admin.routes");
const lurahRoutes = require ("./lurah.routes");
const panitiaRoutes = require ("./panitia.routes");
const pesertaRoutes = require ("./peserta.routes");
const tournamentRoutes = require ('./tournament.routes');

routes.use("/auth", authRoutes);
routes.use("/admin", adminRoutes);
routes.use("/lurah", lurahRoutes);
routes.use("/panitia", panitiaRoutes);
routes.use("/peserta", pesertaRoutes);
routes.use("/tournament", tournamentRoutes);

module.exports = routes;