const express = require('express');
const router = express.Router();

// MIDDLEWARE
const {
  isLoggedIn,
} = require("../middleware/users");

const { asyncErrorHandler } = require("../middleware");

// CONTROLLERS
const {
  postLogin,
  postRegister,
  getProfile,
  putProfile,
  postForgot,
  postForgotConfirm,
  putReset,
  postLoginConfirm,
  postRegisterConfirm
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

router.get("/users/:id", asyncErrorHandler(getProfile));

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



module.exports = router;