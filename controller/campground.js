// console.log("campground.js");

const campground = require("../models/campground");
const campgroundSchema = require("../validationSchema");
const reviewSchema = require("../reviewSchema");
const Review = require("../models/review");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});



module.exports.index = async (req,res)=>{
    const camps = await campground.find({});
    // console.log(camps);
    res.render("campground/index",{camps});
}

module.exports.renderNewFrom = (req,res)=>{
    res.render("campground/new");
}

module.exports.createCampground = async (req,res)=>{   
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const camp = new campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    const images = req.files.map(f=>({
        url: f.path,
        filename: f.filename
    }));
    camp.image = images;
    camp.author = req.user._id;;
    await camp.save();
    req.flash("success","created a campground successfully");
    res.redirect(`/campground/${camp._id}`);

}

module.exports.showCampground = async (req,res)=>{
    const {id} = req.params;
    const camp = await campground.findById(id).populate({
        path: "reviews",
        populate:{
            path:"author"
        }
    }).populate("author","username");
    if(!camp){
        req.flash("error","campground not found");
        return res.redirect("/campground");
    }
    res.render("campground/show",{camp});
}

module.exports.renderEditFrom = async (req,res)=>{
    const {id} = req.params;
    // console.log(id);
    const camp = await campground.findById(id);
    if(!camp){
        req.flash("error","campground not found");
        return res.redirect("/campground");
    }
    res.render("campground/edit",{camp});
}

module.exports.updateCampground = async (req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    console.log(req.body);
    const {id} = req.params;
    const camp = await campground.findByIdAndUpdate(id,{...req.body.campground});
    camp.geometry = geoData.body.features[0].geometry;
    const images = req.files.map(f=>({
        url: f.path,
        filename: f.filename
    }));
    camp.image.push(...images);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash("success","successfully updated campground");
    res.redirect(`/campground/${id}`);


}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    const camp = await campground.findByIdAndDelete(id);
    
    const Y = await Review.deleteMany({
        _id:{
            $in: camp.reviews
        }
    })
    req.flash("success","successfullly deleted the campground");
    res.redirect("/campground");

}

