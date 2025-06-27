const { jwtPayloadSchema } = require("../config/validation");
const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload; // Assuming the JWT contains user info
    console.log("Decoded JWT:", decoded);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to check if user is a coach
function isCoach(req, res, next) {
  if (req.user.role != "coach") {
    return res
      .status(403)
      .json({ msg: "Access denied. Not authorized as coach" });
  }
  next();
}

// middleware/optionalAuth.js
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null; // Not logged in
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}

module.exports = { auth, isCoach, optionalAuth };
