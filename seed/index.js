console.log("index.js");

const mongoose = require("mongoose");
const cities = require("./cities");
const {descriptors,places} = require("./seedHelpers");




mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(()=>{
    console.log("connected");
  })
  .catch((err)=>{
    console.log("there is an error in connecting");
    console.log(err);
  })


const campground = require("../models/campground");
const review = require("../models/review");

function randNum(x){
    return Math.floor(Math.random()*x);
}

const seedDB = async ()=>{
    await campground.deleteMany({});
    await review.deleteMany({});
    console.log("deleted everything");

    const camps = [];
    for(let i = 0;i<200;i++){
        let a = randNum(cities.length),b = randNum(descriptors.length),c = randNum(places.length);
        // console.log(`${a} ${b} ${c}`);
        let price = Math.floor(Math.random()*1000);
        let obj = {
            location: `${cities[a].city} , ${cities[a].state}`,
            geometry: { 
              type: 'Point', 
              coordinates: [
                cities[a].longitude,
                cities[a].latitude
              ]
            },
            title: `${descriptors[b]} ${places[c]}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eveniet inventore dolor nam voluptatibus earum, officiis adipisci sit ratione rerum dicta! Ratione illo odit facilis, ex minima nemo ab dolores.",
            price,
            author: '665c1a44840acc3cec2419aa',
            image:  [
              {
                url: 'https://res.cloudinary.com/dkwjkdd4q/image/upload/v1717574657/yelpCamp/wlzshemam1bmyazlc6o9.png',
                filename: 'yelpCamp/wlzshemam1bmyazlc6o9'
              },
              {
                url: 'https://res.cloudinary.com/dkwjkdd4q/image/upload/v1717574661/yelpCamp/isbr744c89l1cuyayqtf.jpg',
                filename: 'yelpCamp/isbr744c89l1cuyayqtf'
              }
            ],
            
        }
        camps.push(obj);
    }

    // console.log(camps);
    await campground.insertMany(camps);
    console.log("seeding completed");

}

seedDB().then(()=>{
  mongoose.connection.close();
})
.catch((err)=>{
  console.log("some error occured while seeding");
  console.log(err);
})