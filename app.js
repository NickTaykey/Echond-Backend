// packages
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const currentUserId = "5e93363cbb267010ec6a9edd";

// seeds
const seeds = require("./seeds");
// seeds(currentUserId, 20, 10);

// routers
const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users');
const notebookRouter = require('./routes/notebooks');
const indexRouter = require("./routes");

const app = express();

// middleware configs
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// configure express-session
app.use(session({
    secret: 'Etiam sollicitudin ipsum eu',
    resave: false,
    saveUninitialized: false,
}));

// DB connection
mongoose.connect("mongodb://localhost:27017/NoteApp-V1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
// test the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("successfully connected to the DB!"));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const { validateRequest } = require("./middleware");
app.use(validateRequest);

app.use(async(req, res, next)=>{
  // just for development, always logged in user configuration
  let user = await User.findById(currentUserId);
  req.user = user;
  res.locals.currentUser = user;
  // CORS configuration
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// monting routers
app.use('/notes', notesRouter);
app.use('/', usersRouter);
app.use("/notebooks", notebookRouter);
app.use("/", indexRouter);

app.use((err, req, res, next)=>{
  return res.json({ err });
});

module.exports = app;