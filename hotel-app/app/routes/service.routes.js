module.exports = (app) => {
  const services = require("../controllers/service.controller.js");
  const router = require("express").Router();

  router.post("/", services.create);
  router.get("/", services.findAll);
  router.get("/:id", services.findOne);
  router.put("/:id", services.update);
  router.delete("/:id", services.delete);

  app.use("/api/services", router);
};
