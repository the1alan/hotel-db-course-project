module.exports = (app) => {
  const controller = require("../controllers/user.controller.js");
  const { verifyToken, requireRole } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.use(verifyToken, requireRole("admin"));
  router.get("/", controller.findAll);
  router.get("/:id", controller.findOne);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  app.use("/api/users", router);
};
