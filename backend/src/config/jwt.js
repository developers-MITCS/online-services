const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// SIGN TOKEN
const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// VERIFY TOKEN
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
  JWT_EXPIRES_IN,
};
