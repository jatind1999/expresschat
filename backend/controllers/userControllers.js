const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  // destructuring name, email, pass and pic from the request body.
  const { name, email, password, pic } = req.body;

  // check if we receive all values from the form.
  if (!name || !email || !password || !pic) {
    res.status(400).json({ error: "Please enter all fields correctly." });
    throw new Error("Please enter all fields!");
  }

  // checking if the email exists in the database
  const userExists = await User.findOne({ email: email });
  let newUser;
  if (userExists) {
    // If yes then throw error message: User already exists.
    res.status(400).json({ error: "User already Exists in the database." });
    throw new Error("User Already Exists in DB!");
  } else {
    // If no, then create a document and insert into the database.

    newUser = await User.create({
      email: email,
      name: name,
      password: password,
      pic: pic,
    });
  }

  if (newUser) {
    // if successfully created, send the same document as response to the user.
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      pic: newUser.pic,
      token: generateToken(newUser._id),
    });
  } else {
    // If user creation fails, then throw error.
    res.status(400).json({ error: "User Creation Failed" });
    throw new Error("User Creation Failed!");
  }
});

const authUser = asyncHandler(async (req, res) => {
  // fetch password and email from the request's body.
  const { email, password } = req.body;

  // check in the database if the user exists and the password is same or not.
  const user = await User.findOne({ email: email });

  if (user && user.matchPassword(password)) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
    return;
  }
  // Send response appropriately.
  res.status(401).send("Failure");
});

// /api/user/search=username

const allUsers = asyncHandler(async (req, res) => {
  // generate a query based on the url search query.
  const query = req.query.search
    ? {
        $or: [
          { name: { $regex: `${req.query.search}`, $options: "i" } },
          { email: { $regex: `${req.query.search}`, $options: "i" } },
        ],
      }
    : {};

  // query the database to find the user matching the regex.
  const user = await User.find(query).find({ _id: { $ne: req.user._id } });
  console.log(user);
  res.send(user);
});

module.exports = { registerUser, authUser, allUsers };
