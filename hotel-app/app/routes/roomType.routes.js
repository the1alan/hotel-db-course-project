module.exports = (app) => {
  const roomTypes = require("../controllers/roomType.controller.js");
  const router = require("express").Router();

  router.post("/", roomTypes.create);
  router.get("/", roomTypes.findAll);
  router.get("/:id", roomTypes.findOne);
  router.put("/:id", roomTypes.update);
  router.delete("/:id", roomTypes.delete);

  app.use("/api/roomTypes", router);
};
