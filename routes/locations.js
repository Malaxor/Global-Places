const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');

// New location form
router.get('/locations/new', isLoggedIn, (req, res) => {
   res.render('locations/new');
});
module.exports = router;