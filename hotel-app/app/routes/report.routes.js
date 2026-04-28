module.exports = (app) => {
  const controller = require("../controllers/report.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.use(verifyToken, requireRole("admin", "manager"));
  router.get("/occupancy", controller.occupancy);
  router.get("/revenue", controller.revenue);
  router.get("/popular-room-types", controller.popularRoomTypes);
  router.get("/debts", controller.debts);

  app.use("/api/reports", router);
};
