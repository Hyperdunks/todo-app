const { Router } = require("express");
const { userModel } = require("../db.js");
const { sign } = require("jsonwebtoken");
const { userAuth, JWT_USER_PASSWORD } = require("../auth.js");
const bcrypt = require("bcrypt");

const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({
				message: "Username, email, and password are required",
			});
		}

		const existingUser = await userModel.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (existingUser) {
			return res.status(409).json({
				message: "Username or email already taken",
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const dbUser = await userModel.create({
			email: email,
			username: username,
			password: hashedPassword,
		});

		const token = sign(
			{ id: dbUser._id, username: dbUser.username },
			JWT_USER_PASSWORD,
		);

		res.status(201).json({
			message: "Signup successful",
			token: token,
		});
	} catch (e) {
		console.error("Error during signup:", e);
		res.status(500).json({
			message: "An internal server error occurred.",
		});
	}
});

userRouter.post("/signin", async function (req, res) {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				message: "Username and password are required",
			});
		}

		const user = await userModel.findOne({
			username: username,
		});

		if (!user) {
			return res.status(401).json({
				message: "Invalid credentials",
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				message: "Invalid credentials (passowrd is incorrect)",
			});
		}

		const token = sign(
			{ id: user._id, username: user.username },
			JWT_USER_PASSWORD,
		);

		res.json({
			token: token,
		});
	} catch (e) {
		console.error("Error during signin:", e);
		res.status(500).json({
			message: "An internal server error occurred.",
		});
	}
});

module.exports = { userRouter };
