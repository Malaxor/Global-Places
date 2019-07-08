const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
	name: String,
	price: String, 
	image: String,
	description: String,
	locality: String,
	lat: Number,
	lng: Number,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
mongoose.model("Location", locationSchema);