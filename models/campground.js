// console.log("using campground");

const { ref, required } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const opts = { toJSON: {virtuals: true}};
const imageSchema = new Schema(
    {
        url: String,
        filename: String
    }
)

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace("/upload","/upload/w_200");
})

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: [imageSchema],
    geometry:{
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
},
opts);


campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campground/${this._id}" style="text-decoration: none; color: grey">${this.title}</a></strong>`
})



module.exports = mongoose.model("Campground",campgroundSchema);

