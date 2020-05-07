const express = require('express');
const router = express.Router({ mergeParams: true });

const { asyncErrorHandler } = require("../middleware");
const { isLoggedIn } = require("../middleware/users");

const {
    search
} = require("../controllers");


// GET search notebooks and notes
router.get("/search", asyncErrorHandler(isLoggedIn), asyncErrorHandler(search));

module.exports = router;