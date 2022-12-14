const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const dotenv = require('dotenv');

//Init app
const app = express();

//Bodyparse middleware
app.use(express.json());

//Load environment variables
dotenv.config({path: "./config.env"});

const server = http.createServer(app);
const io = socketio(server).sockets;

//Dev loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Db config
const db = config.get('mongoURI');

//Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
useFindAndModify: false })
.then(() => console.log('MongoDb Connected '))
.catch((err) => console.log(err));

app.get("/", (req, res) => res.send("The home page has been hit."));
app.use("/api/users", require('./routes/api/users'));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000; 
server.listen(port, () => `Server started on port ${port}`)