const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocationSchema = new Schema({
	name: String,
	price: String, 
	description: String,
	location: String,
});
mongoose.model("Location", LocationSchema);