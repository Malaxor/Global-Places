const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const Comment = mongoose.model('Comment');
const { isLoggedIn } = require("../middleware");

// New: show new comment form
router.get('/locations/:id/comments/new', isLoggedIn, (req, res) => {
   Location.findById(req.params.id, (err, location) => {
		if(err) {
			console.log(err);
		}
		else {
			res.render("comments/new", { location });
		}
	});
});
// Create
router.post('/locations/:id/comments', isLoggedIn, (req, res) => {
	Location.findById(req.params.id, (err, location) => {
		if(err) {
			console.log(err);
		}
		else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					console.log(err);
				}
				else {
					const { _id, username } = req.user;
					comment.author.id = _id;
					comment.author.username = username;
					comment.save();
					
					location.comments.push(comment);
					location.save();
					req.flash("success", "You've added a comment.");
					res.redirect(`/locations/${req.params.id}`);
				}
			});
		}
	});
});
module.exports = router;