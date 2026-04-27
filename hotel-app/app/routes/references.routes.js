module.exports = (app) => {
  const references = require("../controllers/references.controller.js");
  const router = require("express").Router();

  router.get("/", references.findAll);
  router.get("/:entity", references.findByEntity);
  router.get("/:entity/:id", references.findOne);
  router.post("/:entity", references.create);
  router.put("/:entity/:id", references.update);
  router.delete("/:entity/:id", references.delete);

  app.use("/api/references", router);
};
