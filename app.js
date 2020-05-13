// packages
const express = require('express');
const mongoose = require("mongoose");

const currentUserId = "5ebafbbaaf335d05f6979a49";
// seeds
const seeds = require("./seeds");
// seeds(currentUserId, 5, 10);

// routers
const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users');
const notebookRouter = require('./routes/notebooks');
const indexRouter = require("./routes");

const app = express();

// middleware configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
mongoose.connect("mongodb://localhost:27017/NoteApp-V2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
// test the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("successfully connected to the DB!"));

const { validateRequest } = require("./middleware");
app.use(validateRequest);

app.use(async(req, res, next)=>{
  // CORS configuration
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// monting routers
app.use('/:JWTtoken/notes/', notesRouter);
app.use('/', usersRouter);
app.use("/:JWTtoken/notebooks/", notebookRouter);
app.use("/:JWTtoken", indexRouter);

app.use((err, req, res, next)=>{
  return res.json({ err });
});

module.exports = app;