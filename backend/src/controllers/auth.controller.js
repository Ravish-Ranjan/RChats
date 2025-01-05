import { sign } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
    try {
        const { fullname, email, password, profilepic } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already used" });
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            profilepic,
        });
        if (newUser) {
            sign(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    profilepic: newUser.profilepic,
                },
            });
        }
        return res.status(400).json({ message: "Failed to create user" });
    } catch (error) {
        console.log("Error creating user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        sign(user._id, res);
        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                profilepic: user.profilepic,
            },
        });
    } catch (error) {
        console.log("Error logging in:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error logging out:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changeProfilePic = async (req, res) => {
    try {
        const { _id } = req.user;
        const { profilepic } = req.body;
        if (!profilepic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const cloudResponse = await cloudinary.uploader.upload(profilepic);
        const user = await User.findByIdAndUpdate(
            _id,
            { profilepic: cloudResponse.secure_url },
            { new: true }
        );

        if (user) {
            return res.status(200).json({
                message: "Profile pic changed successfully",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    profilepic: user.profilepic,
                },
            });
        } else {
            return res
                .status(400)
                .json({ message: "Failed to change profile pic" });
        }
    } catch (error) {
        console.log("Error changing profile pic:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        return res
            .status(200)
            .json({ message: "Autheticated", user: req.user });
    } catch (error) {
        console.log("Error checking auth:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
