const { jwtPayloadSchema } = require("../config/validation");
const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = jwtPayloadSchema.safeParse(decoded);
    if (!result.success) {
      return res.status(401).json({ msg: "Token payload is invalid" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

// Middleware to check if user is a coach
function isCoach(req, res, next) {
  if (req.user.role !== "coach") {
    return res
      .status(403)
      .json({ msg: "Access denied. Not authorized as coach" });
  }
  next();
}

module.exports = { auth, isCoach };
