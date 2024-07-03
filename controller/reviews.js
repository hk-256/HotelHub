//console.log("reviews.js");
const Review = require("../models/review");
const review = require("../models/review");
const campground = require("../models/campground");

module.exports.createReview = async (req,res)=>{
    const {id} = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const camp = await campground.findById(id);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success","successfully added review");
    res.redirect(`/campground/${id}`);
    
}

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    const Y = await campground.updateOne({_id:id},{
        $pull:{
            reviews: reviewId
        }
    });
    // console.log(Y);
    const X = await review.findByIdAndDelete(reviewId);
    req.flash("success","successfully deleted review");
    res.redirect(`/campground/${id}`);
}