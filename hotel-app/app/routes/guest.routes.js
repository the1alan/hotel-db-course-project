module.exports = (app) => {
  const guests = require("../controllers/guest.controller.js");
  const router = require("express").Router();

  router.post("/", guests.create);
  router.get("/", guests.findAll);
  router.get("/:id", guests.findOne);
  router.put("/:id", guests.update);
  router.delete("/:id", guests.delete);

  app.use("/api/guests", router);
};