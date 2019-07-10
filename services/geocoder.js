const NodeGeocoder = require('node-geocoder');
const { geocoderAPI } = require('../config/keys');

const options = {
   provider: 'google',
   httpAdapter: 'https',
   apiKey: geocoderAPI,
   formatter: null
};
const geocoder = NodeGeocoder(options);

module.exports = { 
   geocoder 
};