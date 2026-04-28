module.exports = (app) => {
  const controller = require("../controllers/auth.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.get("/me", verifyToken, controller.me);

  app.use("/api/auth", router);
};
