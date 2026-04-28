module.exports = (app) => {
  const controller = require("../controllers/references.controller.js");
  const router = require("express").Router();

  router.get("/", controller.findAll);

  app.use("/api/references", router);
};
