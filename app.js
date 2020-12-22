const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongooseConnect = require("./configs/mongoose.config");
const cors = require("cors");
// const formidableMiddleware = require('express-formidable');
// var multer = require('multer');
// var upload = multer();
global.__basedir = __dirname

const routes = require("./routes");

const app = express();

app.use(cors());

mongooseConnect();

app.use(bodyParser.json());
// app.use(formidableMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
// router.get("/", (req, res, next) => {
  
// });

app.use(routes);

module.exports = app;