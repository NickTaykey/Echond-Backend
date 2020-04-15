const express = require('express');
const router = express.Router();

// MIDDLEWARE
const {
    isLoggedIn
} = require("../middleware/users");

const {
asyncErrorHandler
} = require("../middleware");

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
    asyncErrorHandler(notebookUpdate)
);

// DELETE destroy
router.delete(
    "/:id",
    isLoggedIn, 
    asyncErrorHandler(notebookDestroy)
);

module.exports = router;