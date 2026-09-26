import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import passport from "./config/passport.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:5173"],
		credentials: true,
	}),
);

app.use(passport.initialize());

app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
	console.log(
		`CheraLabs API running in ${env.NODE_ENV} mode on port ${env.PORT}`,
	);
});
