//console.log("user.js");

const express = require("express");
const router = express.Router({mergeParams: true});

const User = require("../models/user");
const passport = require("passport");
const user = require("../controller/user")

const { storeReturnTo } = require('../middleware');

router.route("/register")
    .get(user.renderRegister)
    .post(user.register)

router.route("/login")
    .get(user.renderLogin)
    .post(storeReturnTo,passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),user.login);

router.get("/logout",user.logout)

module.exports = router;
