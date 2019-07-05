const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
	username: { type: String, unique: true },
	password: String,
	firstName: String,
	lastName: String,
	email: { type: String, unique: true },
	avatar: String,
	isAdmin: { type: Boolean, default: false }
});
UserSchema.plugin(passportLocalMongoose);
mongoose.model("User", UserSchema);