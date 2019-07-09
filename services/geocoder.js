const NodeGeocoder = require('node-geocoder');

const options = {
   provider: 'google',
   httpAdapter: 'https',
   apiKey: "AIzaSyBs2MrV7l8KQcs7dVqVQl4v55TfXWrL3Mo",
   formatter: null
};
const geocoder = NodeGeocoder(options);

module.exports = { 
   geocoder 
};