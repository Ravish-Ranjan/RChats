import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import helmet from "helmet";

import authRouter from "./routers/auth.router.js";
import messageRouter from "./routers/message.router.js";
import connectDb from "./libs/connectDb.js";
import { app, server } from "./libs/socket.js";

dotenv.config();

app.use(
	helmet({
		hidePoweredBy: true,
		noSniff: true,
		xssFilter: true,
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				imgSrc: [
					"'self'",
					"data:",
					"blob:",
					"https://res.cloudinary.com", // Cloudinary CDN
				],
				mediaSrc: [
					"'self'",
					"data:",
					"blob:",
					"https://res.cloudinary.com",
				],
				connectSrc: [
					"'self'",
					"https://api.cloudinary.com", // Cloudinary API
				],
				scriptSrc: [
					"'self'",
					"'unsafe-inline'",
					"https://res.cloudinary.com",
				],
				styleSrc: ["'self'", "'unsafe-inline'"],
			},
		},
	})
);
app.use(express.json({ limit: "50mb" }));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
	fileUpload({
		limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});
// }
server.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
	connectDb();
});
