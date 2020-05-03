const express = require('express');
const router = express.Router();

// MIDDLEWARE
const {
  isLoggedIn,
  checkUserAccountOwnerShip
} = require("../middleware/users");

const { asyncErrorHandler } = require("../middleware");

// CONTROLLERS
const {
  postLogin,
  postRegister,
  getProfile,
  putProfile,
  postForgot,
  putReset,
  postLoginConfirm,
  postRegisterConfirm
} = require("../controllers/users");

// Users

// - postLogin (login a user)
//    type: POST
//    url: /login

router.post("/login", postLogin);

router.post("/loginConfirm", asyncErrorHandler(postLoginConfirm));

// - postRegister (register a new user)
//    type: POST
//    url: /register

router.post("/register", asyncErrorHandler(postRegister));

router.post("/registerConfirm", asyncErrorHandler(postRegisterConfirm));

// - profileGet (get a specific user's info)
//    type: GET
//    url: /users/:id

router.get("/users/:id", asyncErrorHandler(getProfile));


// - profileUpdate (update a specific user's info)
//    type: PUT
//    url: /users/:id
//    middleware: isLoggedIn; checkUserAccountOwnerShip

router.put(
  "/users/:id",
  asyncErrorHandler(isLoggedIn),
  asyncErrorHandler(checkUserAccountOwnerShip),
  asyncErrorHandler(putProfile)
);

// - forgotPost (start pwd reset)
//    type: POST
//    url: /forgot

router.post("/forgot", asyncErrorHandler(postForgot));

   
// - resetPost (validate user's token and change pwd)
//    type: PUT
//    url: /reset

router.put("/reset", asyncErrorHandler(putReset));



module.exports = router;