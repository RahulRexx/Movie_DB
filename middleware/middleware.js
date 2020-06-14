var {Movie} = require("../models/movies.js");
var {User} = require("../models/users.js");


var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in ");
    res.redirect("/login");
};

module.exports = {
    isLoggedIn
};