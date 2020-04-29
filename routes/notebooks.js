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
    checkIfNotebookExists,
    checkNotebookOwnership
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
    asyncErrorHandler(isLoggedIn),
    asyncErrorHandler(notebookIndex)
);


// POST create
router.post(
    "/",
    asyncErrorHandler(isLoggedIn),
    asyncErrorHandler(notebookCreate)
);

// PUT update
router.put(
    "/:id",
    asyncErrorHandler(isLoggedIn),
    asyncErrorHandler(checkIfNotebookExists),
    asyncErrorHandler(checkNotebookOwnership),
    asyncErrorHandler(notebookUpdate)
);

// DELETE destroy
router.delete(
    "/:id",
    asyncErrorHandler(isLoggedIn),
    asyncErrorHandler(checkIfNotebookExists),
    asyncErrorHandler(checkNotebookOwnership),
    asyncErrorHandler(notebookDestroy)
);

module.exports = router;