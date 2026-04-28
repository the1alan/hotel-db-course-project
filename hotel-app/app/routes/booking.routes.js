module.exports = (app) => {
  const controller = require("../controllers/booking.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.get("/", controller.findAll);
  router.get("/:id", controller.findOne);
  router.post("/", verifyToken, requireRole("admin", "manager", "receptionist"), controller.create);
  router.put("/:id", verifyToken, requireRole("admin", "manager", "receptionist"), controller.update);
  router.delete("/:id", verifyToken, requireRole("admin", "manager"), controller.delete);

  app.use("/api/bookings", router);
};
