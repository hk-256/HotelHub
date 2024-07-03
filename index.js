// console.log("index.js");

if(process.env.NODE_ENV !=="production"){
    require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const methodOverride = require("method-override");
const session = require("express-session");
const flash =  require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const mongoSanitize = require("express-mongo-sanitize");
const helmet  = require("helmet");

const MongoStore = require("connect-mongo");

app.use(mongoSanitize({
    replaceWith: '_'
}));



const User = require("./models/user");

const campgroundRoute = require('./routes/campground');
const reviewRoute = require("./routes/ReviewS");
const userRoute = require("./routes/user");

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);




// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl)
  .then(()=>{
    console.log("connected");
  })
  .catch((err)=>{
    console.log("there is an error in connecting");
    console.log(err);
  })

  
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.listen(5500,()=>{
    console.log("started listening to the port 5500");
})

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'fuckthisshit'
    }
});

const sessionConfig = {
    store,
    name: "session",
    secret: "fuckthishit",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:  1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://cdn.jsdelivr.net",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dkwjkdd4q/", 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/user",async (req,res)=>{

//     const user = new User({email: "demo@email",username:"demoUsername"});
//     const rex = await User.register(user,"password");
//     res.send(rex);
// })

app.use((req,res,next)=>{
    
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.get("/",(req,res)=>{
res.render("home");
})

app.use("/",userRoute);
app.use("/campground",campgroundRoute);
app.use("/campground/:id/review",reviewRoute);






app.all("*",(req,res,next)=>{
    throw new ExpressError("Nothing found",404);
})


app.use((err,req,res,next)=>{
    const {status=500} = err;
    if(!err.message){
        err.message = "Error Occured"; 
    }
    
    res.status(status).render("error",{err});
})













