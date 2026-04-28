const db = require("../models");
const { QueryTypes } = require("sequelize");

exports.occupancy = async (req, res) => {
  try {
    const result = await db.sequelize.query(`SELECT r.number, COUNT(b.id) as bookings FROM rooms r LEFT JOIN bookings b ON r.id = b.roomId GROUP BY r.number ORDER BY bookings DESC`, { type: QueryTypes.SELECT });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.revenue = async (req, res) => {
  try {
    const result = await db.sequelize.query(`SELECT SUM(amount) as total_revenue FROM payments WHERE status = 'paid'`, { type: QueryTypes.SELECT });
    res.json(result[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.popularRooms = async (req, res) => {
  try {
    const result = await db.sequelize.query(`SELECT roomId, COUNT(*) as total FROM bookings GROUP BY roomId ORDER BY total DESC`, { type: QueryTypes.SELECT });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
