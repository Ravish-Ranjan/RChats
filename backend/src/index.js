import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import authRouter from "./routers/auth.router.js";
import messageRouter from "./routers/message.router.js";
import connectDb from "./libs/connectDb.js";

dotenv.config();
const app = express();

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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDb();
});
