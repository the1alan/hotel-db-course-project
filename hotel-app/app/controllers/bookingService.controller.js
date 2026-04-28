const db = require("../models");
const BookingService = db.bookingServices;

exports.create = async (req, res) => {
  try {
    const bookingService = await BookingService.create(req.body);
    res.status(201).json(bookingService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const bookingServices = await BookingService.findAll();
    res.json(bookingServices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const bookingService = await BookingService.findByPk(req.params.id);
    if (!bookingService) {
      return res.status(404).json({ message: "BookingService not found" });
    }

    res.json(bookingService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await BookingService.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "BookingService not found" });
    }

    res.json({ message: "BookingService updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await BookingService.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "BookingService not found" });
    }

    res.json({ message: "BookingService deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
