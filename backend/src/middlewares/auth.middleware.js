import User from "../models/user.model.js";
import jwtPackage from "jsonwebtoken";

export const authenticated = async (req, res, next) => {
    try {
        const { jwt } = req.cookies;
        if (!jwt) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { userid } = jwtPackage.verify(jwt, process.env.JWT_SECRET);
        if (!userid) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(userid).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilepic: user.profilepic,
        };
        next();
    } catch (error) {
        console.log("Error authenticating user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
