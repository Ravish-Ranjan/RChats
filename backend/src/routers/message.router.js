import express from "express";
import { authenticated } from "../middlewares/auth.middleware.js";
import {
    getSidebarUsers,
    getMessages,
    sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", authenticated, getSidebarUsers);
router.get("/:id", authenticated, getMessages);
router.post("/send/:id", authenticated, sendMessage);

export default router;
