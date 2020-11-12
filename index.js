const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const { mongoURI } = require('./config/keys');
const port = process.env.PORT || 4000;
const methodOverride = require("method-override");
// mongoose models
require('./models/User');
require('./models/Location');
require('./models/Comment');
const User = mongoose.model('User');
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
// activate HTTP verbs "Delete" and "Put" on HTML forms 
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.set('view engine', 'ejs');
/***********************  Passport and Local Strategy Config ****************************/
passport.use(new localStrategy(User.authenticate()));
app.use(require("express-session") ({
	secret: "yes no maybe",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/****************************************************************************************/
// add req.user and flash to all routes
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
// routes
app.use(require('./routes/index'));
app.use(require('./routes/locations'));
app.use(require('./routes/comments'));

app.listen(port, () => console.log(`Server running on port ${port}`));