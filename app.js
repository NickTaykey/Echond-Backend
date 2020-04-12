// packages
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// routers
const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users');

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

// monting routers
app.use('/notes', notesRouter);
app.use('/', usersRouter);

module.exports = app;