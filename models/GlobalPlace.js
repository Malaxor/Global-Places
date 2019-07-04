const mongoose = require("mongoose");
const { Schema } = mongoose;

const GlobalPlaceSchema = new Schema({
	name: String,
	price: String, 
	description: String,
	location: String,
});
const GlobalPlace = mongoose.model("GlobalPlace", GlobalPlaceSchema);
module.exports = GlobalPlace;