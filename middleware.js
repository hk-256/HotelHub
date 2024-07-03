//console.log("middleware.js");
const campground = require("./models/campground")
const review = require("./models/review")
const reviewSchema = require("./reviewSchema");
const campgroundSchema = require("./validationSchema");
const ExpressError = require("./utils/ExpressError")
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
      
        next();
    
}

module.exports.isLoggedIn = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    else{
        next();
    }
}



module.exports.isAuthor = async (req,res,next)=>{
    
    const {id} = req.params;
    const camp = await campground.findById(id);

    if(!camp.author.equals(req.user._id)){
        req.flash("error","You are not authorized");
        res.redirect(`/campground/${id}`);
    }
    else{
        next();
    }

}

module.exports.isReviewAuthor = async (req,res,next)=>{

    const {id,reviewId} = req.params;
    const rev = await review.findById(reviewId);

    if(!rev.author.equals(req.user._id)){
        req.flash("error","You are not authorized");
        res.redirect(`/campground/${id}`);
    }
    else{
        next();
    }

}

module.exports.validateCampground = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(msg, 404);
    }

    next();
    
}


module.exports.validateReview = (req,res,next)=>{
   
    const {error} = reviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(msg, 404);
    }

    next();
    
}