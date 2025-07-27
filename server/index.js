require("dotenv").config({ path: "./../.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
	console.log("Request received!");
	res.send("Hello from the backend!");
});

async function main() {
	await mongoose.connect(process.env.MONGODB_URI);
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}
main();
