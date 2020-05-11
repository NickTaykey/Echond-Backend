const express = require('express');
const router = express.Router();

// MIDDLEWARE
const {
  isLoggedIn,
} = require("../middleware/users");

const { asyncErrorHandler } = require("../middleware");

const { 
  checkIfNoteExists, 
  checkUserNoteOwnerShip 
} = require("../middleware/notes");

// CONTROLLERS
const {
  postLogin,
  postRegister,
  findUsers,
  putProfile,
  postForgot,
  postForgotConfirm,
  putReset,
  postLoginConfirm,
  postRegisterConfirm,
  putShareNote
} = require("../controllers/users");

// Users

// login entry point
router.post("/login", postLogin);
// confirm login token
router.post("/loginConfirm", asyncErrorHandler(postLoginConfirm));

// user registration entry point
router.post("/register", asyncErrorHandler(postRegister));
// confirm users phone number via token
router.post("/registerConfirm", asyncErrorHandler(postRegisterConfirm));

router.get("/users", asyncErrorHandler(findUsers));

// update user's info
router.put(
  "/:JWTtoken",
  asyncErrorHandler(isLoggedIn),
  putProfile
);

// forgot password entry point
router.post("/forgot", asyncErrorHandler(postForgot));
// forgot password confirm token
router.post("/forgotConfirm", asyncErrorHandler(postForgotConfirm));
// reset password
router.put("/reset", asyncErrorHandler(putReset));

router.put(
  "/:JWTtoken/shareNote/:id/user/:username",
  asyncErrorHandler(isLoggedIn),
  asyncErrorHandler(checkIfNoteExists),
  asyncErrorHandler(checkUserNoteOwnerShip),
  asyncErrorHandler(putShareNote)
);



module.exports = router;