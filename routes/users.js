const express = require('express');
const router = express.Router();

// MIDDLEWARE
const {
  isLoggedIn,
  checkUserAccountOwnerShip
} = require("../middleware/users");


// CONTROLLERS
const {
  postLogin,
  getLogout,
  postRegister,
  getProfile,
  putProfile,
  postForgot,
  putReset
} = require("../controllers/users");

// Users

// - postLogin (login a user)
//    type: POST
//    url: /login

router.post("/login", postLogin);

// - getLogout
//    type: GET
//    url: /logout

router.get("/logout", getLogout);


// - postRegister (register a new user)
//    type: POST
//    url: /register

router.post("/register", postRegister);

// - profileGet (get a specific user's info)
//    type: GET
//    url: /users/:id

router.get("/users/:id", getProfile);


// - profileUpdate (update a specific user's info)
//    type: PUT
//    url: /users/:id
//    middleware: isLoggedIn; checkUserAccountOwnerShip

router.put(
  "/users/:id",
  isLoggedIn,
  checkUserAccountOwnerShip,
  putProfile
);

// - forgotPost (start pwd reset)
//    type: POST
//    url: /forgot

router.post("/forgot", postForgot);

   
// - resetPost (validate user's token and change pwd)
//    type: PUT
//    url: /reset

router.put("/reset", putReset);



module.exports = router;