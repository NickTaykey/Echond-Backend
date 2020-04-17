const express = require('express');
const router = express.Router();

// MIDDLEWARE
const {
  isLoggedIn,
  checkUserNoteOwnerShip
} = require("../middleware/users");

const {
  searchAndFilter
} = require("../middleware/notes");

const { asyncErrorHandler } = require("../middleware");

// CONTROLLERS
const {
  noteIndex,
  noteCreate,
  noteUpdate,
  noteDestroy
} = require("../controllers/notes");

// Notes

// - noteIndex (retrieve all the notes of the authenticated user)
//   type: GET
//   url:  /notes
//   middlewares: isLoggedIn

router.get(
  "/", 
  isLoggedIn, 
  asyncErrorHandler(noteIndex)
);

// - noteCreate (create a note for the authenticated user)
//   type: POST
//   url:  /notes
//   middlewares: isLoggedIn

router.post("/", isLoggedIn, asyncErrorHandler(noteCreate));

// - noteUpdate (update a specific note)
//   type: PUT
//   url:  /notes/:id
//   middlewares: isLoggedIn; checkUserNoteOwnerShip

router.put(
  "/:id", 
  isLoggedIn, 
  asyncErrorHandler(checkUserNoteOwnerShip),
  asyncErrorHandler(noteUpdate)
);

// - noteDestroy (destroy a specific note)
//    type: DELETE
//    url:  /notes/:id
//    middlewares: isLoggedIn; checkUserNoteOwnerShip

router.delete(
  "/:id", 
  isLoggedIn, 
  asyncErrorHandler(checkUserNoteOwnerShip),
  asyncErrorHandler(noteDestroy)
);


module.exports = router;
