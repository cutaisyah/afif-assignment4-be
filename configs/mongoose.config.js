const mongoose = require("mongoose");
// const dbConfig = {
//   HOST: "localhost",
//   PORT: 27017,
//   DB: "Database_Assignment4_Tournament",
// };
const Role = require("../models/Role.model");
const District = require("../models/District.model");
const TournamentIsStarted = require("../models/TournamentIsStarted.model");
const TournamentCategory = require("../models/TournamentCategory.model");

const mongooseConnect = () => {
  //   const dburl = `mongodb+srv://belajarangular:belajarangular@cluster0.ful4b.mongodb.net/belajar1?retryWrites=true&w=majority`
  const dburl = `mongodb://localhost:27017/Database_Assignment4_Tournament`;
  //   mongoose
  //     .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };
  mongoose.connect(dburl, connectionOptions);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "Connection Error:"));
  db.once("open", () => {
    console.log(`Mongoose Connected!`);
  });
};

module.exports = mongooseConnect;