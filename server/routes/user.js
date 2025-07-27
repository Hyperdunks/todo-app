const { Router } = require("express");
const { userModel } = require("../db.js");
const { sign } = require("jsonwebtoken");
const { userAuth, JWT_USER_PASSWORD } = require("../auth.js");

const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
	const { username, email, password } = req.body;
	// TODO: validation for inputs
	// BUG: not hashing password (venerability)
	await userModel.create({
		email: email,
		username: username,
		password: password,
	});

	res.json({
		message: "Signup succeeded",
	});
});

userRouter.post("/signin", async function (req, res) {
	const { username, password } = req.body;

	const user = await userModel.findOne({
		username: username,
		password: password,
	});

	if (user) {
		const token = sign(
			{
				id: user._id,
			},
			JWT_USER_PASSWORD,
		);

		res.json({
			token: token,
		});
		// Do local storage auth or cookie logic
	} else {
		res.status(403).json({
			message: "Incorrect credentials",
		});
	}
});

module.exports = { userRouter };
