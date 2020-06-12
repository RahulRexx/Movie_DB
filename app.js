require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("./db/mongoose.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");
var {User} = require("./models/users.js");
var {sendMail} = require("./mail.js");




var app = express();



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(express.static(__dirname + "/public"));

//======================Express-session=============================== (secret  will be used to encode and decode the sessions )
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
//===========================Passport requirement===================================
app.use(passport.initialize());
app.use(passport.session());

//=========================passport==================================(They are responsible for reading the session & taking the data form the session ,encode it and unencoding it  )
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //encode it ,and put it back inn the session
passport.deserializeUser(User.deserializeUser()); // this "serializeUser" and "DeserializeUser" method is given by "passport-local-mongoose" on the User model;
//=================================================================

app.use((req,res,next) => {
    res.locals.currentuser = req.user;
    res.locals.warning = req.flash("warning");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
});


app.get("/test",(req,res) => {
    res.render("test");
});

app.get("/" ,(req,res) => {
    res.render("landing");
});
//=======================Home page==============================================
app.get("/movies",(req,res) => {
    res.render("home");
});

//====================== Search page===============================================
app.post("/movies",(req,res1) => {
    // console.log(req.body.movie);
    var name = req.body.movie.name;
    var type = req.body.movie.type;
    var year = req.body.movie.year;
    
    console.log(name,year,type);
    var result;
    var url = "http://www.omdbapi.com/?apikey=6049af90&s=" + name;
    if(type)
    {
        url = url + "&type="+type;
    }
    if(year)
    {
        url = url + "&y="+year;
    }
    // console.log(url);
    request(url,(err,res,body) => {
        result = JSON.parse(body);
        // console.log(result.Search);
        if(result.Search) {
            res1.render("movies", {result : result.Search});
        }
        else  {
            req.flash("warning","No result found!!! Please enter a valid name");
            console.log("hitted");
            res1.redirect("/movies");
        }
    });
});


//============show page==================================================
app.post("/movies/:id" ,(req1,res1) => {
    // console.log();
    var name = req1.params.id;
    var result;
    var url = "http://www.omdbapi.com/?apikey=6049af90&i=" + name +"&plot=full";
    // console.log(url);
    
    request(url, (err, res, body) => {
        result = JSON.parse(body);
        // console.log(result.Search);
        if (result) {
            res1.render("moviesinfo", { result: result });
        }
        else {
            req.flash("warning","No result found!!!! Please enter a valid name");
            // console.log("hitted");
            res1.redirect("/movies");
        }
    });
});

//====================contact me form ====================

app.get("/contact",(req,res) => {
    res.render("contact");
});

app.post("/contact",(req,res) => {
    console.log("Contact hitted");
    
    // console.log(req.body.name, req.body.email, req.body.message);

    sendMail(req.body.email, req.body.subject, req.body.message ,(err,data) => {
        if(err)
        {
           req.flash("error","Failed to send your message!!!")
            res.redirect("/contact");
        }
        else{
            console.log(data);
            
            req.flash("success", "Messege Sent");
            res.redirect("/movies");
        }
    });

});


//=======================Sign-up form =======================

app.get("/register", (req, res) => {

    res.render("register");
});


app.post("/register", (req, res) => {
    // console.log(req.body.username, req.body.password);
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            // console.log("error is",err);
            req.flash("error", "This username already exist!, Try  different one");
            return res.redirect("/register");
        }
        //local for local mode // facebook for facebook mode // twitter for twitter mode of authentication
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Hii ${req.body.username}! Welcome to the Movie DB!`);
            res.redirect("/movies");
        })

    });
});



//=======================Login page ==============================
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successFlash: "Welcome Back!",
    successRedirect: "/movies",
    failureFlash: "Invalid Username or Password",
    failureRedirect: "/login"

}), (req, res) => {
});


//======================= Logout =================================
app.get("/logout", (req, res) => {
    req.logout(); //req.logout() == passport destroys all the user data in the session ,it no longer keeping tracks of this user data in the session
    req.flash("success", "Logged out seccessfully. Look forward to seeing you again!");
    res.redirect("/movies");
});

app.listen(process.env.PORT,() => {
    console.log("Server Started");
});