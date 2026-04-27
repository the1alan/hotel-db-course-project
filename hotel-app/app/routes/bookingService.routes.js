module.exports = (app) => {
  const bookingServices = require("../controllers/bookingService.controller.js");
  const router = require("express").Router();

  router.post("/", bookingServices.create);
  router.get("/", bookingServices.findAll);
  router.get("/:id", bookingServices.findOne);
  router.put("/:id", bookingServices.update);
  router.delete("/:id", bookingServices.delete);

  app.use("/api/bookingServices", router);
};
