//console.log("user.js")


const User = require("../models/user");
const passport = require("passport");


module.exports.renderRegister = (req,res)=>{
    res.render("user/register");
}

module.exports.register = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({
            username: username,
            email: email
        });
        const registerdUser = await User.register(user,password);
        req.login(registerdUser,(e)=>{
            if(e) next(e);
            req.flash('success',"welcome to yelpcamp");
            res.redirect("/campground");
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect("/register");    
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("user/login");
}


module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campground';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((e)=>{
        if(e){
            next(e);
        }
        else{
            req.flash("success","you are successfully logged out");
            res.redirect("/campground");
        }
    });
}