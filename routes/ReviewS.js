// console.log("using reviews.js");


const express = require("express");
const router = express.Router({mergeParams: true});

const campgroundSchema = require("../validationSchema");
const reviewSchema = require("../reviewSchema");
const Review = require("../models/review");
const review = require("../models/review");
const campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const {validateReview, isLoggedIn,isAuthor,isReviewAuthor} = require("../middleware");
const reviews = require("../controller/reviews");


router.post("/",isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete("/:reviewId/delete",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))


module.exports = router;