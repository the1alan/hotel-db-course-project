module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const router = require("express").Router();

  router.get("/occupancy", reports.occupancy);
  router.get("/revenue", reports.revenue);
  router.get("/popular", reports.popularRooms);

  app.use("/api/reports", router);
};
