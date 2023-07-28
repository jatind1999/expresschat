const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JSON_SECRET, { expiresIn: "30d" });
  return token;
};

module.exports = generateToken;
