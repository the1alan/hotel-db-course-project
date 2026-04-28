module.exports = (app) => {
  const controller = require("../controllers/room.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.get("/", controller.findAll);
  router.get("/available", controller.findAvailable);
  router.get("/:id", controller.findOne);
  router.post("/", verifyToken, requireRole("admin", "manager"), controller.create);
  router.put("/:id", verifyToken, requireRole("admin", "manager"), controller.update);
  router.delete("/:id", verifyToken, requireRole("admin"), controller.delete);

  app.use("/api/rooms", router);
};
