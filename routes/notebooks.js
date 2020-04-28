const express = require('express');
const router = express.Router({ mergeParams: true });

// MIDDLEWARE
const {
    isLoggedIn
} = require("../middleware/users");

const {
    asyncErrorHandler
} = require("../middleware");

const {
    checkIfNotebookExists
} = require("../middleware/notebooks");

// CONTROLLERS
const { 
    notebookIndex,
    notebookCreate,
    notebookUpdate,
    notebookDestroy
} = require("../controllers/notebooks");



// GET index
router.get(
    "/",
    isLoggedIn, 
    asyncErrorHandler(notebookIndex)
);


// POST create
router.post(
    "/",
    isLoggedIn, 
    asyncErrorHandler(notebookCreate)
);

// PUT update
router.put(
    "/:id",
    isLoggedIn, 
    asyncErrorHandler(checkIfNotebookExists),
    asyncErrorHandler(notebookUpdate)
);

// DELETE destroy
router.delete(
    "/:id",
    isLoggedIn, 
    asyncErrorHandler(checkIfNotebookExists),
    asyncErrorHandler(notebookDestroy)
);

module.exports = router;