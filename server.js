const express = require ("express");
const cors = require ("cors");
const mongooseConnection = require ("./configs/mongoose.config");
const routes = require ("./routes")
const app = express();
const port = 8080;

var corsOptions = {origin: "http://localhost:8081"};
app.use(cors(corsOptions));
mongooseConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);


app.listen(port, ()=>{
    console.log(`App runs on http://localhost:${port}`);
});