const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        throw new Error("No Content or Chat Id sent.");
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        // create a new message and save it in the db.
        let message = await Message.create(newMessage);

        // Populate the message created with all sub fields.
        message = await message.populate("sender", "-password");
        message = await message.populate("chat");

        message = await User.populate(message, {
            path: "chat.users",
            select: "name email pic",
        });

        // find the chatId and update the last message with the new message.
        const updatedChat = await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        // send final response to the user.
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;

    try {
        // fetch all the messages correspoding to the chat.
        const messages = await Message.find({ chat: chatId });

        res.json(messages);
    } catch (error) {
        throw new Error(error.message);
    }
});
module.exports = { sendMessage, allMessages };
