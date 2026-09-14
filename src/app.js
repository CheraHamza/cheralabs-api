import "dotenv/config";
import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
	if (error) {
		throw error;
	}
	console.log(`app listening on port ${PORT}`);
});
