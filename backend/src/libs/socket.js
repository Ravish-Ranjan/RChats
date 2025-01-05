import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getRecieverId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {}; //{userid:socketid}

io.on("connection", (socket) => {
    const userid = socket.handshake.query.userId;
    if (userid) userSocketMap[userid] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        delete userSocketMap[userid];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
