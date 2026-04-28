module.exports = (app) => {
  const controller = require("../controllers/service.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.get("/", controller.findAll);
  router.get("/:id", controller.findOne);
  router.post("/", verifyToken, requireRole("admin", "manager"), controller.create);
  router.put("/:id", verifyToken, requireRole("admin", "manager"), controller.update);
  router.delete("/:id", verifyToken, requireRole("admin"), controller.delete);

  app.use("/api/services", router);
};
