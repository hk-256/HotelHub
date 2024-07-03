// console.log("inside routes");

const express = require("express");
const router = express.Router();

// const campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const campgroundSchema = require("../validationSchema");
const reviewSchema = require("../reviewSchema");
const Review = require("../models/review");
const {isLoggedIn,validateCampground,isAuthor} = require("../middleware");
const campground = require("../controller/campground");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array("image"),validateCampground, catchAsync(campground.createCampground))
    
router.get("/new",isLoggedIn,campground.renderNewFrom)


router.route("/:id")
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditFrom))


module.exports = router;