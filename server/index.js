const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cockieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router");
const errorMiddleware = require("./middlewares/error-middleware");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cockieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
);
app.use("/app", router);
app.use(errorMiddleware);

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL);
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};

start();
