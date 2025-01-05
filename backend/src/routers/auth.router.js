import express from "express";
import {
    login,
    logout,
    signup,
    changeProfilePic,
    checkAuth
} from "../controllers/auth.controller.js";
import { authenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/changeprofilepic", authenticated, changeProfilePic);
router.get("/authenticated",authenticated, checkAuth);

export default router;
