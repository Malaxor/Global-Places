const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(User.authenticate()));
app.use(require("express-session")({
	secret: "lucky strike",
	resave: false,
	saveUninitialized: false
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());