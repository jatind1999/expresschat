const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  let bearerToken;
  // check if the user is logged in or not.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // extract the bearer token from the authorization header.
      bearerToken = req.headers.authorization.split(" ")[1];

      // once we have the bearer token, we need to decode the token.
      // Decoding will give us the user_id of logged in user.

      const decodedToken = jwt.verify(bearerToken, process.env.JSON_SECRET);

      // at this point, we have the user id of the logged in user.
      // Querying the Db for the same user.

      req.user = await User.findById(decodedToken.id).select("-password");
      // call the next middleware.
      next();
    } catch (error) {
      res.status(401);
      throw new Error(error);
    }
  }

  if (!bearerToken) {
    res.status(401);
    throw new Error("Not Authorized, No token");
  }
};

module.exports = protect;
