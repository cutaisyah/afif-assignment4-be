const express = require ("express");
const cors = require ("cors");
const mongooseConnection = require ("./configs/mongoose.config");
const routes = require ("./routes")
const app = express();
const port = normalizePort(process.env.PORT || "8080")
const http = require('http');

var corsOptions = {origin: "http://localhost:4200"};
app.use(cors(corsOptions));
mongooseConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
  
  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
  };


app.set("port", port);
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

server.listen(port, ()=>{
    console.log(`App runs on http://localhost:${port}`);
});