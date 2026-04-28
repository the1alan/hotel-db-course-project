module.exports = (app) => {
  const bookings = require("../controllers/booking.controller.js");
  const router = require("express").Router();

  router.post("/", bookings.create);
  router.get("/", bookings.findAll);
  router.get("/:id", bookings.findOne);
  router.put("/:id", bookings.update);
  router.delete("/:id", bookings.delete);

  app.use("/api/bookings", router);
};
