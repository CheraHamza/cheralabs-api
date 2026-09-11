import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
	res.json({
		message: "Welcome to the cheralabs API",
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
	if (error) {
		throw error;
	}
	console.log(`app listening on port ${PORT}`);
});
