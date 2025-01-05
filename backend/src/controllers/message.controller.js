import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";

export const getSidebarUsers = async (req, res) => {
    try {
        const { _id } = req.user;
        const users = await User.find({ _id: { $ne: _id } }).select(
            "-password"
        );
        res.status(200).json(users);
    } catch (error) {
        console.log("Error getting sidebar users:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const myid = req.user._id;
        const { id: chatUserId } = req.params;
        if (!chatUserId) {
            return res.status(400).json({ message: "User not found" });
        }
        const messages = await Message.find({
            $or: [
                { senderId: myid, recieverId: chatUserId },
                { senderId: chatUserId, recieverId: myid },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error getting messages:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: recieverId } = req.params;
        const { content, image } = req.body;
        if (!recieverId) {
            return res.status(400).json({ message: "User Not Found" });
        }
        let newMessage = {
            senderId,
            recieverId,
        };
        if (!content && !image) {
            return res
                .status(400)
                .json({ message: "Either text or image is required" });
        }
        if (content) newMessage.content = content;
        if (image) {
            const cloudRes = await cloudinary.uploader.upload(profilepic);
            newMessage.image = cloudRes.secure_url;
        }
        const message = new Message(newMessage);
        await message.save();
        // todo : add realtime functionality here

        return res.status(201).json(message);
    } catch (error) {
        console.log("Error sending message:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
