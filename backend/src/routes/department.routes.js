const express = require("express");
const router = express.Router();
const controller = require("../controllers/department.controller");
//to add middleware after testing
const middleware = require("../middleware/auth.middleware");

router.get("/", middleware.verifyToken, controller.getAll);
router.get("/:id", middleware.verifyToken, controller.getById);
router.post("/", middleware.verifyToken, controller.create);
router.put("/:id", middleware.verifyToken, controller.update);
router.delete("/:id", middleware.verifyToken, controller.delete);

module.exports = router;
