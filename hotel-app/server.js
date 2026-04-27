require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized.");
  })
  .catch((err) => {
    console.log("Failed to synchronize database:", err.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Hotel database management API is running",
  });
});
require("./app/routes/guest.routes")(app);
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
