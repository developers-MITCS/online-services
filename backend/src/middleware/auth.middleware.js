const { verifyToken: verifyJwt } = require("../config/jwt");
const db = require("../config/db");

// ===============================
// VERIFY TOKEN (WITH EXPIRATION)
// ===============================
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token);

    req.user = decoded;
    next();
  } catch (err) {
    // 🔥 TOKEN EXPIRED
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        expired: true,
      });
    }

    // 🔥 INVALID TOKEN
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// ===============================
// LOAD FULL USER FROM DATABASE
// ===============================
exports.loadUser = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const [rows] = await db.query(
      "SELECT id, username, email, role, status FROM users WHERE id = ? LIMIT 1",
      [req.user.id],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error("loadUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ===============================
// ROLE CHECKER (SECURITY FIXED)
// ===============================
exports.requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: Insufficient role",
      });
    }

    next();
  };
};
