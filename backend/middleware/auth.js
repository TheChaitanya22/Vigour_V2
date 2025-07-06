const { jwtPayloadSchema } = require("../config/validation");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload;
    console.log(req.user.id);
    console.log("Decoded JWT:", decoded);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

function isCoach(req, res, next) {
  if (req.user.role !== "coach") {
    return res
      .status(403)
      .json({ msg: "Access denied. Not authorized as coach" });
  }
  console.log("🔍 req.user in isCoach:", req.user);
  next();
}

function optionalAuth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload;
  } catch (error) {
    req.user = null;
  }

  next();
}

module.exports = { auth, isCoach, optionalAuth };
