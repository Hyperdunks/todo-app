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
		await userModel.create({
			email: email,
			username: username,
			password: hashedPassword,
		});

		res.status(201).json({
			message: "Signup successful",
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

		// Combine the user not found and wrong password cases to prevent username enumeration
		if (!user) {
			return res.status(401).json({
				// 401 Unauthorized is more standard
				message: "Invalid credentials",
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				message: "Invalid credentials (passowrd is incorrect)",
			});
		}

		// If credentials are correct, create and send token
		const token = sign(
			{ id: user._id, username: user.username }, // Include more user info if needed
			JWT_USER_PASSWORD,
			{ expiresIn: "1h" }, // Good practice to set an expiration
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
