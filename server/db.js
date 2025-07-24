const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
	email: { type: String, unique: true },
	username: String,
	password: String,
});

const todoSchema = new Schema({
	username: {
		type: ObjectId,
		ref: "user",
	}, // a foreign key connecting both tables together
	title: String,
	description: String,
	date: { type: Date, default: Date.now() },
	status: Boolean,
	til: Date,
});

const userModel = mongoose.model("user", userSchema);
const todoModel = mongoose.model("todo", todoSchema);

module.exports = {
	userModel,
	todoModel,
};
