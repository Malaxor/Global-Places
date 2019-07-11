const mongoose = require('mongoose');
const Location = mongoose.model('Location');

module.exports = {
   isLoggedIn(req, res, next) {
      if(req.isAuthenticated()) {
         return next();
      }
      req.flash("error", "You need to be logged in to do that.");
      res.redirect("/login");
   },
   checkLocationOwner(req, res, next) {
      // if you're logged in
      if(req.isAuthenticated()) {
         Location.findById(req.params.id, (err, location) => {
            if(err) {
               req.flash("error", "location not found");
               res.redirect("back");
            } 
            else {
               // if the logged in user's id matches the id of the person who posted the global location
               if(location.author.id.equals(req.user._id) || req.user && req.user.isAdmin) {
                  next();
               } // if you're logged in as somebody else but attempt to access the locations/:id/edit url
               else {
                  req.flash("error", "You don't have permission to do that.");
                  res.redirect("back");
               }
            }
         });
      } 
      else {
         req.flash("error", "You need to be logged in to do that.");
         res.redirect("back");
      }
   }
};