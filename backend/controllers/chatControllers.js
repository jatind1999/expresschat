const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

const accessChat = asyncHandler(async (req, res) => {
    // check if the request body has userid, then proceed. Otherwise throw error.
    const { userId } = req.body;

    if (!userId) {
        console.log("Error: No User Id present in the request!");
        res.sendStatus(400);
        return;
    }
    let chat;
    // fetch chat related to the chatid.
    chat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (chat.length > 0) {
        res.send(chat[0]);
    } else {
        console.log("No Chat Found, Creating a new one-on-one chat.");

        try {
            // No new chats, create one. and populate the fields correctly.
            const newChat = await Chat.create({
                chatName: "New Chat",
                isGroupChat: false,
                users: [req.user._id, userId],
            });
            const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).send(fullChat);
        } catch (error) {
            throw new Error(error);
            2;
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    // check if the user is logged in or not.
    if (!req.user._id) {
        res.status(401);
        throw new Error("User is not logged in.");
    }

    // fetch all the chats from the user id in the body of request.
    let chats;
    try {
        chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email pic",
        });
    } catch (error) {
        console.log(error);
    }

    res.send(chats);
});

const createGroupChat = asyncHandler(async (req, res) => {
    // check if the group chat name is empty or users array is empty.
    if (!req.body.groupName || !req.body.users) {
        res.status(400).send("Group Name or users list empty!");
        return;
    }

    // Parse the incoming string array.
    let users = JSON.parse(req.body.users);

    // add the logged in user to the list of group members.
    users.push(req.user._id);

    // check if the users list is less than 2.
    if (users.length < 2) {
        res.status(400).send("Group creation needs atleast 2 people.");
        return;
    }

    try {
        // Create a chat with groupAdmin as logged in user.
        const newGroup = await Chat.create({
            chatName: req.body.groupName,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user._id,
        });

        // fetch the newly created group and populate fields.
        const fullGroupChat = await Chat.findById({ _id: newGroup._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat);
    } catch (error) {
        throw new Error(error);
    }
});

const renameGroupChat = asyncHandler(async (req, res) => {
    // check if the chat id or new group name is not present.
    if (!req.body.groupChatId || !req.body.groupName) {
        res.status(400).send(
            "Group Chat Id or New Group name not sent to server."
        );
        return;
    }

    try {
        // find and update the chat with new name and send server response.
        const updatedChat = await Chat.findByIdAndUpdate(
            req.body.groupChatId,
            {
                chatName: req.body.groupName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.send(updatedChat);
    } catch (error) {
        res.status(400).send(error);
    }
});

const addUserToGroup = asyncHandler(async (req, res) => {
    // Extract userId and group id from the body.
    const { userId, groupId } = req.body;
    // check if the user id or group id is missing.
    if (!userId || !groupId) {
        res.status(400).send(
            "Group Id and user id is mandatory for adding user. Please send both in request."
        );
        return;
    }

    // search and update the group chat with a new user.
    const updatedChat = await Chat.findByIdAndUpdate(
        groupId,
        {
            $push: { users: userId },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(400).send("Chat Not Found!");
        throw new Error("No Chat Found");
    }

    res.send(updatedChat);
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
    // Extract userId and group id from the body.
    const { userId, groupId } = req.body;
    // check if the user id or group id is missing.
    if (!userId || !groupId) {
        res.status(400).send(
            "Group Id and chat id is mandatory for adding user. Please send both in request."
        );
        return;
    }

    // search and update the group chat by removing user.
    const updatedChat = await Chat.findByIdAndUpdate(
        groupId,
        {
            $pull: { users: userId },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(400).send("Chat Not Found!");
        throw new Error("No Chat Found");
    }
    res.send(updatedChat);
});
module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroupChat,
    addUserToGroup,
    removeUserFromGroup,
};
