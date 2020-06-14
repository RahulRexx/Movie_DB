var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// var {Movie} = require("./movies.js");

var userSchema = new mongoose.Schema({
    username: String,
    passport: String,
    movies : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Movie"
        }
    ]
});

//===========================================================================================always after schema

userSchema.plugin(passportLocalMongoose); // passportLocalSchema comes with a lot of methods that will be added in userSchema

//==========================================================================================

var User = mongoose.model("Users", userSchema);

module.exports = {
    User
};