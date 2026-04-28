module.exports = (app) => {
  const controller = require("../controllers/staff.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.get("/", verifyToken, requireRole("admin", "manager"), controller.findAll);
  router.get("/:id", verifyToken, requireRole("admin", "manager"), controller.findOne);
  router.post("/", verifyToken, requireRole("admin"), controller.create);
  router.put("/:id", verifyToken, requireRole("admin"), controller.update);
  router.delete("/:id", verifyToken, requireRole("admin"), controller.delete);

  app.use("/api/staff", router);
};
