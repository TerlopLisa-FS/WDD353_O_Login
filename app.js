"use strict"
let express = require("express");
let ejs = require("ejs");
let bodyParser = require("body-parser");
let request = require("request");
let session = require("express-session")

let router = express.Router();
let app = express();
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express)
let sess;
// Routes
router.get("/", (req, res) => {
    sess = req.session;
    res.render("index", {
        pagename: "index",
        sess: sess,
    })
})

router.get("/about", (req, res) => {
    sess = req.session;
    res.render("about", {
        pagename: "about",
        sess: sess,
    })
})

router.get("/profile", (req, res) => {
    sess = req.session;
    if (typeof(sess) === "undefined" || sess.loggedin !== true) {
        let errors = ["Not authenticated user"];
        res.render("index", {
            pagename: "index",
            errs: errors,
        })
    }else {
        res.render("profile", {
            pagename: "profile",
            sess: sess,
        })
    }
})

router.get("/logout", (req, res) => {
    sess = req.session;
    sess.destroy((err) => {
        res.redirect("/")
    })
})

router.get("/portfolio", (req, res) => {
    sess = req.session;
    res.render("portfolio", {
        pagename: "portfolio",
        sess: sess,
    })
})

router.post("/login", (req, res) => {
    console.log(req.body);
    let errors = [];
    // Validate the email not blank.
    if(req.body.email.trim() === "") {
        errors.push("Email cannot be blank");
    }

    // Validate the password not blank.
    if(req.body.password.trim() === "") {
        errors.push("Password cannot be blank");
    }

    // Validate the email incorrect format.
    if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$/.test(req.body.email)) {
        errors.push("Invalid Email address");
    }

    // Validate the password incorrect format.
    if(!/^[a-zA-Z0-9_.+-]+$/.test(req.body.password)) {
        errors.push("Invalid password format");
    }

    // Create a condition for correct email and password
    if (req.body.email.toLowerCase() === "mike@aol.com" && req.body.password === "abc123") {
        sess = req.session;
        sess.loggedin = true;
        res.render("profile", {
            pagename: "profile",
            sess: sess,
        })
    } else {
        errors.push("Invalid User");
        sess.loggedin = false;
        res.render("index", {
            pagename: "index",
            errs: errors,
        })
    }
})

// Declare Static File Locations
app.use(express.static("views"));
app.use(express.static("public"));
app.use("/", router);
// Start Server
let server = app.listen("8080", () => {
    console.log("Server running on port 8080");
});