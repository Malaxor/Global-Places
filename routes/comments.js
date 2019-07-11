const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const Comment = mongoose.model('Comment');
const { isLoggedIn, checkCommentOwner } = require("../middleware");

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
// Edit: render edit form 
router.get('/locations/:id/comments/:comment_id/edit', checkCommentOwner, (req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		if(err) {
			res.redirect("back");
		}
		else {
			res.render("comments/edit", { location_id: req.params.id, comment });
		}
	});
});
// Update 
router.put('/locations/:id/comments/:comment_id', checkCommentOwner, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back");
		}
		else {
			res.redirect(`/locations/${req.params.id}`);
		}
	});
});
// Destroy
router.delete('/locations/:id/comments/:comment_id', checkCommentOwner, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, err => {
		if(err) {
			res.redirect("/");
		}
		else {
			res.redirect('back');
			req.flash("success", "You've successfully removed the comment.");
		}
	});
});
module.exports = router;