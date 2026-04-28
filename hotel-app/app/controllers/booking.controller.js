const db = require("../models");
const Booking = db.bookings;

exports.create = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create booking" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch bookings" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch booking" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Booking.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update booking" });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Booking.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete booking" });
  }
};
