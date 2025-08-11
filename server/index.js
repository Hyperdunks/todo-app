require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const app = express();
const port = process.env.PORT;
console.log(process.env.PORT);

app.use("/user", userRouter);

// landing page
app.get("/", (req, res) => {
	console.log("Request on / endpoint!");
	res.send("Hello from the backend!");
});

async function main() {
	await mongoose.connect(process.env.MONGODB_URI);
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}
main();
