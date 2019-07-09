const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Index
// router.get('/', (req, res) => {
//    res.render("locations/index");
// });
// Show Register Form   
router.get('/register', (req, res) => {
   res.render("register", { page: "register" });
});
// Sign Up Logic
router.post("/register", (req, res) => {
   const { username, firstName, lastName, email, avatar, adminCode, password } = req.body;
   const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      avatar
   });
   if(adminCode === "IglooHot") {
      newUser.isAdmin = true;
   }
   // register is provided by passport-local-mongoose plugin that I've affixed to the User model
   User.register(newUser, password, (err, user) => {
      if(err) {
         console.log(err);
         return res.render("register", { error: err.message });
      }
      passport.authenticate("local")(req, res, () => {
         req.flash("success", `Nice to meet you ${username}`);
         res.redirect("/"); 
      });
   });
});
// Show Login Form
router.get('/login', (req, res) => {
   res.render('login', { page: 'login' });
});
// Login Logic
router.post("/login", passport.authenticate("local", 
   {
		successRedirect: "/",
		failureRedirect: "/login"
	}), 
	(req, res) => {
});
// Sign Out Logic
router.get('/logout', (req, res) => {
   req.logout();
   req.flash("success", "You've logged out.")
   res.redirect('/');
});
module.exports = router;