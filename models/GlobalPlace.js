const mongoose = require("mongoose");
const { Schema } = mongoose;

const WhereaboutSchema = new Schema({
	name: String,
	price: String, 
	description: String,
	location: String,
});
module.exports = mongoose.model("Whereabout", WhereaboutSchema);
