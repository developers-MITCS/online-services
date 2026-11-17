const express = require("express");
const router = express.Router();
const controller = require("../controllers/employee.controller");
const middleware = require("../middleware/auth.middleware");

router.get("/", controller.getAll);
router.get("/:id", middleware.verifyToken, controller.getById);
router.post("/", middleware.verifyToken, controller.create);
router.put("/:id", middleware.verifyToken, controller.update);
router.delete("/:id", middleware.verifyToken, controller.delete);
router.get(
  "/department/:department_id",
  // middleware.verifyToken,
  controller.getByDepartment,
);

module.exports = router;
