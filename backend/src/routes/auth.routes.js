const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth.controller");
const middleware = require("../middleware/auth.middleware");

router.post("/register", auth.register);
router.post("/login", auth.login);
// protected route
router.get("/me", middleware.verifyToken, middleware.loadUser, auth.me);
router.get("/users", auth.getAll);

module.exports = router;
