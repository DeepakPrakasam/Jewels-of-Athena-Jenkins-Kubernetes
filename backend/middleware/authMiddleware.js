// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied. Token malformed." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; 

    next(); // allow request to continue
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next(); // allow admin to continue
}

// ✅ Optional: More flexible role-based middleware
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for your role." });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  isAdmin,
  authorizeRoles,
};
