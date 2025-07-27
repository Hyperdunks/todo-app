const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD =
	process.env.JWT_USER_PASSWORD || "some_secure_password";

// TODO: Improvement with token storing in local.storage
function userAuth(req, res, next) {
	const token = req.headers.token;
	const decoded = jwt.verify(token, JWT_USER_PASSWORD);

	if (decoded) {
		req.userId = decoded.id;
		next();
	} else {
		res.status(403).json({
			message: "You are not signed in",
		});
	}
}

module.exports = {
	userAuth,
	JWT_USER_PASSWORD,
};
