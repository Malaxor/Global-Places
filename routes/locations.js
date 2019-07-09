const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const { isLoggedIn } = require('../middleware');
const { cloudinary, upload } = require('../services/imageUpload');
const { geocoder } = require('../services/geocoder');

// anti-DDOS attack 
function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
// Index
router.get("/", (req, res) => {
	let noMatch;

	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		
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
// Create
router.post("/locations", isLoggedIn, upload.single('image'), (req, res) => {
	const { name, price, description, locality } = req.body;
	const { _id, username } = req.user;

	cloudinary.uploader.upload(req.file.path, result => {
		const image = result.secure_url;
		const author = {
			id: _id,
			username
		};
  		geocoder.geocode(locality, (err, data) => {
			if (err || !data.length) {
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
// new location form
router.get('/locations/new', isLoggedIn, (req, res) => {
   res.render('locations/new');
});
module.exports = router;