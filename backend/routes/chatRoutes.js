const express = require("express");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controllers/chatControllers");
const protect = require("../middlewares/authMiddleware");

// Here all the routes related to chats are defined.

// Route 1 - Creating or Accessing 1-on-1 chat with two users.
router.route("/").post(protect, accessChat);

// Route 2 - Fetching all chats for any user.
router.route("/").get(protect, fetchChats);

// Route 3 - Creating a group chat
router.route("/group").post(protect, createGroupChat);

// Route 4 - Renaming a group chat
router.route("/rename").put(protect, renameGroupChat);

// Route 4 - Adding a user to group
router.route("/groupadd").put(protect, addUserToGroup);

// Route 5 - Removing a user from group.
router.route("/groupremove").put(protect, removeUserFromGroup);

module.exports = router;
