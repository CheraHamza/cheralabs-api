import express from "express";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(env.PORT, () => {
	console.log(
		`CheraLabs API running in ${env.NODE_ENV} mode on port ${env.PORT}`,
	);
});
