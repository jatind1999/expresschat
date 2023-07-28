const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
    sendMessage,
    allMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

// send message
router.route("/").post(protect, sendMessage);

// fetch all messages of the specified chat id.
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
