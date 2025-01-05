import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/auth.router.js";
import messageRouter from "./routers/message.router.js";
import connectDb from "./libs/connectDb.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDb();
});
