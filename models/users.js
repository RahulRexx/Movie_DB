var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    passport: String
});

//===========================================================================================always after schema

userSchema.plugin(passportLocalMongoose); // passportLocalSchema comes with a lot of methods that will be added in userSchema

//==========================================================================================

var User = mongoose.model("Users", userSchema);

module.exports = {
    User
};