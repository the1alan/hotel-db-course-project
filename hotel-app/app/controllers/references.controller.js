const db = require("../models");
const { handleError } = require("../utils/http");

exports.findAll = async (_req, res) => {
  try {
    const [roomTypes, services, staff] = await Promise.all([
      db.roomTypes.findAll(),
      db.services.findAll(),
      db.staff.findAll({ attributes: { exclude: ["password_hash"] } }),
    ]);

    res.json({ roomTypes, services, staff });
  } catch (error) {
    handleError(res, error, "Failed to fetch references");
  }
};
