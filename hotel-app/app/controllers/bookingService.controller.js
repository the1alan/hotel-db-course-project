const db = require("../models");
const BookingService = db.bookingServices;
const Booking = db.bookings;
const Service = db.services;
const { handleError } = require("../utils/http");

exports.create = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.body.bookingId);
    const service = await Service.findByPk(req.body.serviceId);
    if (!booking || !service) {
      return res.status(400).json({ message: "bookingId and serviceId must be valid" });
    }

    res.status(201).json(await BookingService.create(req.body));
  } catch (error) {
    handleError(res, error, "Failed to create booking service");
  }
};

exports.findAll = async (_req, res) => {
  try {
    res.json(await BookingService.findAll({ include: [Booking, Service] }));
  } catch (error) {
    handleError(res, error, "Failed to fetch booking services");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await BookingService.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Booking service not found" });
    res.json({ message: "Booking service deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete booking service");
  }
};
