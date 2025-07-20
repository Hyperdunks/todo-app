require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
	console.log("Request received!");
	res.send("Hello from the backend!");
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
