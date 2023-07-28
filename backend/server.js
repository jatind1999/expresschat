const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
const chats = require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");

const PORT = process.env.PORT || 5500;
app.use(
    cors({
        origin: `https://64c4022440213634535c102c--expresschat.netlify.app:${PORT}/`,
    })
);
// First basic route.
app.get("", (req, res) => {
    res.send("Working!!!!!");
});

// User Routes
app.use("/api/user", userRoutes);

// Chat Routes
app.use("/api/chat", chatRoutes);

// Message routes.
app.use("/api/message", messageRoutes);

// Error handling routes

// 1. Not Found route.
app.use(notFound);

// 2. Uncaught Errors
app.use(errorHandler);

const server = app.listen(
    PORT,
    console.log(`Server started on port ${PORT}.`.yellow.underline)
);

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("New Client-Server socket connection established.");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("New room created/joined. Room Id: ", userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (chatId) => {
        socket.join(chatId);
        console.log(`Client socket attached to chat: ${chatId}`);
    });
    socket.on("typing", (chatId) => {
        socket.to(chatId).emit("typing");
    });
    socket.on("stop typing", (chatId) => {
        socket.to(chatId).emit("stop typing");
    });
    socket.on("new message", (receivedMessage) => {
        const chat = receivedMessage.chat;

        if (!chat.users) return console.log("No users in the chat.");

        chat.users.forEach((user) => {
            if (user._id === receivedMessage.sender._id) return;

            socket.to(user._id).emit("message received", receivedMessage);
        });
    });

    socket.off("setup", (userData) => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    });
});
