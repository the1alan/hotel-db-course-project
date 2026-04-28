module.exports = (app) => {
  const controller = require("../controllers/bookingService.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.get("/", controller.findAll);
  router.post("/", verifyToken, requireRole("admin", "manager", "receptionist"), controller.create);
  router.delete("/:id", verifyToken, requireRole("admin", "manager"), controller.delete);

  app.use("/api/booking-services", router);
  app.use("/api/bookingServices", router);
};
