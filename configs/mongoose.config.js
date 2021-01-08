const mongoose = require("mongoose");

const mongooseConnect = () => {
  const dburl = `mongodb://localhost:27017/Database_Assignment4_Tournament`;
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