const db = require("../models");
const { QueryTypes } = require("sequelize");
const { handleError } = require("../utils/http");

const validatePeriod = (from, to) => {
  if (!from || !to) return "from and to query params are required";
  if (new Date(to) <= new Date(from)) return "to must be later than from";
  return null;
};

exports.occupancy = async (req, res) => {
  try {
    const { from, to } = req.query;
    const periodError = validatePeriod(from, to);
    if (periodError) return res.status(400).json({ message: periodError });

    const rows = await db.sequelize.query(
      `SELECT r.id AS room_id,
              r.number AS room_number,
              rt.name AS room_type,
              COUNT(b.id) AS bookings_count,
              COALESCE(SUM(GREATEST(0, LEAST(b.check_out_date::date, :to::date) - GREATEST(b.check_in_date::date, :from::date))),0) AS occupied_days,
              ROUND((COALESCE(SUM(GREATEST(0, LEAST(b.check_out_date::date, :to::date) - GREATEST(b.check_in_date::date, :from::date))),0) * 100.0)
               / GREATEST(1, (:to::date - :from::date)), 2) AS occupancy_percent
       FROM rooms r
       LEFT JOIN room_types rt ON rt.id = r."roomTypeId"
       LEFT JOIN bookings b ON b."roomId" = r.id
         AND b.status IN ('created','confirmed','checked_in','checked_out')
         AND b.check_in_date < :to
         AND b.check_out_date > :from
       GROUP BY r.id, r.number, rt.name
       ORDER BY r.number`,
      { replacements: { from, to }, type: QueryTypes.SELECT }
    );

    res.json(rows);
  } catch (error) {
    handleError(res, error, "Failed to build occupancy report");
  }
};

exports.revenue = async (req, res) => {
  try {
    const { from, to } = req.query;
    const periodError = validatePeriod(from, to);
    if (periodError) return res.status(400).json({ message: periodError });

    const [summary] = await db.sequelize.query(
      `SELECT COALESCE(SUM(amount),0) AS total_revenue,
              COUNT(*)::int AS payments_count,
              COALESCE(AVG(amount),0) AS average_payment
       FROM payments
       WHERE status = 'paid'
         AND payment_date >= :from
         AND payment_date < :to`,
      { replacements: { from, to }, type: QueryTypes.SELECT }
    );

    const byMethod = await db.sequelize.query(
      `SELECT method, COALESCE(SUM(amount),0) AS revenue
       FROM payments
       WHERE status = 'paid'
         AND payment_date >= :from
         AND payment_date < :to
       GROUP BY method
       ORDER BY revenue DESC`,
      { replacements: { from, to }, type: QueryTypes.SELECT }
    );

    res.json({ ...summary, revenue_by_method: byMethod });
  } catch (error) {
    handleError(res, error, "Failed to build revenue report");
  }
};

exports.popularRoomTypes = async (req, res) => {
  try {
    const { from, to } = req.query;
    const periodError = validatePeriod(from, to);
    if (periodError) return res.status(400).json({ message: periodError });

    const rows = await db.sequelize.query(
      `SELECT rt.id AS room_type_id,
              rt.name AS room_type,
              COUNT(b.id)::int AS bookings_count,
              COALESCE(SUM(b.total_price),0) AS total_amount,
              COALESCE(AVG(b.total_price),0) AS average_booking_amount
       FROM room_types rt
       LEFT JOIN rooms r ON r."roomTypeId" = rt.id
       LEFT JOIN bookings b ON b."roomId" = r.id
         AND b.check_in_date < :to
         AND b.check_out_date > :from
       GROUP BY rt.id, rt.name
       ORDER BY bookings_count DESC, total_amount DESC`,
      { replacements: { from, to }, type: QueryTypes.SELECT }
    );

    res.json(rows);
  } catch (error) {
    handleError(res, error, "Failed to build room type popularity report");
  }
};

exports.debts = async (_req, res) => {
  try {
    const rows = await db.sequelize.query(
      `SELECT b.id AS booking_id,
              CONCAT(g.first_name, ' ', g.last_name) AS guest,
              r.number AS room,
              b.total_price,
              COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END),0) AS paid_amount,
              (b.total_price - COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END),0)) AS debt_amount
       FROM bookings b
       JOIN guests g ON g.id = b."guestId"
       JOIN rooms r ON r.id = b."roomId"
       LEFT JOIN payments p ON p."bookingId" = b.id
       GROUP BY b.id, g.first_name, g.last_name, r.number
       HAVING COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END),0) < b.total_price
       ORDER BY debt_amount DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json(rows);
  } catch (error) {
    handleError(res, error, "Failed to build debts report");
  }
};
