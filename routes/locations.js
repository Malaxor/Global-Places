const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const { isLoggedIn, checkLocationOwner } = require('../middleware');
const { cloudinary, upload } = require('../services/imageUpload');
const { geocoder } = require('../services/geocoder');

// anti-DDOS attack 
function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
// Index: display all locations
router.get("/", (req, res) => {
	let noMatch;

	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		// fuzzy search
		Location.find({ name: regex }, (err, locations) => {
			if(err) {
				console.log(err);
			}
			else {
				if(locations.length < 1) {
					noMatch = "No global locations match that query. Please try again."
				}
				res.render("locations/index", { locations, page: 'locations', noMatch });
			}
		});
	}
	else {
		Location.find({}, (err, locations) => {
			if(err) {
				console.log(err);
			}
			else {
				res.render("locations/index", { locations, page: 'locations', noMatch });
			}
	   });
	}	
});
// New: render a new location form
router.get('/locations/new', isLoggedIn, (req, res) => {
   res.render('locations/new');
});
// Create: create a new location, then redirect to index page
router.post('/locations', isLoggedIn, upload.single('image'), (req, res) => {
	const { name, price, description, locality } = req.body;
	const { _id, username } = req.user;
	const author = {
		id: _id,
		username
	};
	cloudinary.uploader.upload(req.file.path, result => {
		const image = result.secure_url;

  		geocoder.geocode(locality, (err, data) => {
			if(err || !data.length) {
				req.flash('error', 'Invalid address.');
				return res.redirect('back');
			}
			const lat = data[0].latitude;
			const lng = data[0].longitude;
			const location = data[0].formattedAddress;

			const newLocation = {
				name, 
				price, 
				image, 
				description, 
				author, 
				lat, 
				lng,
				locality: location
			};
			Location.create(newLocation, err => {
				if(err) {
					console.log(err);
				}
				else {
					res.redirect("/");
				}
			});
		});
	});	
});
// Show: render a page that displays details about a specific location
router.get('/locations/:id', (req, res) => {
	Location.findById(req.params.id).populate("comments").exec((err, location) => {
		if(err) {
			console.log(err);
		}
		else {
			res.render("locations/show", { location });
		}
	});
});
// Edit: Show edit form
router.get('/locations/:id/edit', checkLocationOwner, (req, res) => {
	Location.findById(req.params.id, (err, location) => {
		err ? console.log(err) : res.render("locations/edit", { location });
	});
});
// Update
router.put('/locations/:id', isLoggedIn, upload.single('image'), (req, res) => {
	const { name, price, description, locality } = req.body;

	cloudinary.uploader.upload(req.file.path, result => {
		const image = result.secure_url;

  		geocoder.geocode(locality, (err, data) => {
			if(err || !data.length) {
				req.flash('error', 'Invalid address.');
				return res.redirect('back');
			}
			const lat = data[0].latitude;
			const lng = data[0].longitude;
			const location = data[0].formattedAddress;
			const newData = {
				name, 
				price, 
				image, 
				description,  
				lat, 
				lng,
				locality: location
			};
			Location.findByIdAndUpdate(req.params.id, newData, (err, location) => {
				if(err){
	         	req.flash("error", err.message);
	            res.redirect("back");
			  	} 
			  	else {
					req.flash("success", "You've updated the global location.");
	         	res.redirect(`/locations/${location._id}`);
	        	}
			});
		});
	});	
});
// Destroy: remove global location
router.delete("/locations/:id", checkLocationOwner, (req, res) => {
	Location.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			req.flash("error", 'Location can\'t be deleted...');
		}
		req.flash('success', "Deletion was successfull. ");
		res.redirect("/");
	});
});
module.exports = router;