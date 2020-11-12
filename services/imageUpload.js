const cloudinary = require('cloudinary');
const multer = require('multer');
const { cloudinaryAPIkey, cloudinaryAPIsecret } = require('../config/keys');

// Campground Image Upload
const storage = multer.diskStorage({
	filename: function(req, file, callback) {
   	callback(null, Date.now() + file.originalname);
  	}	
});
const imageFilter = (req, file, cb) => {
   // accept image files only
   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
   }
   cb(null, true);
}
const upload = multer({ 
	storage, 
	fileFilter: imageFilter
});
cloudinary.config({ 
	cloud_name: 'dld0q2clm', 
  	api_key: cloudinaryAPIkey,
  	api_secret: cloudinaryAPIsecret
});
module.exports = {
   upload,
   cloudinary
}