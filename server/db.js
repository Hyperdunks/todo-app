const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const todoSchema = new Schema(
	{
		username: {
			type: ObjectId,
			ref: "user",
			required: true,
		}, // a foreign key connecting both tables together
		title: {
			type: String,
			required: true,
		},
		description: String,
		date: { type: Date, default: Date.now },
		status: {
			type: String,
			enum: ["completed", "pending", "in-progress"],
			default: "pending",
		},
		dueDate: Date,
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
	},
	{ timestamps: true },
);

const userModel = mongoose.model("user", userSchema);
const todoModel = mongoose.model("todo", todoSchema);

module.exports = {
	userModel,
	todoModel,
};
