const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});
mongoose.model("Comment", commentSchema);