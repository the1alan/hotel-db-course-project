const db = require("../models");
const Payment = db.payments;
const Booking = db.bookings;
const { handleError } = require("../utils/http");

exports.create = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.body.bookingId);
    if (!booking) return res.status(400).json({ message: "Invalid bookingId" });

    res.status(201).json(await Payment.create(req.body));
  } catch (error) {
    handleError(res, error, "Failed to create payment");
  }
};

exports.findAll = async (_req, res) => {
  try {
    res.json(await Payment.findAll({ include: [Booking] }));
  } catch (error) {
    handleError(res, error, "Failed to fetch payments");
  }
};

exports.findOne = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, { include: [Booking] });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    handleError(res, error, "Failed to fetch payment");
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.bookingId) {
      const booking = await Booking.findByPk(req.body.bookingId);
      if (!booking) return res.status(400).json({ message: "Invalid bookingId" });
    }

    const [count] = await Payment.update(req.body, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update payment");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await Payment.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete payment");
  }
};
