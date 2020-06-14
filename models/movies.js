const mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    Poster : String,
    Title : String,
    Released : String,
    imdbRating: String,
    imdbID: String,
    Type: String,
    Runtime: String,
    Genre: String,
    Plot: String
});

var Movie = mongoose.model("Movie",movieSchema);

module.exports = {
    Movie
}