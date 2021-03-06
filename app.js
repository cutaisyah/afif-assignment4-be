const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongooseConnect = require("./configs/mongoose.config");
const cors = require("cors");
global.__basedir = __dirname

const routes = require("./routes");

const app = express();

app.use(cors());

mongooseConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/image", express.static(path.join("image")));

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

app.use(routes);

module.exports = app;