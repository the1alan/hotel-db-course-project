const db = require("../models");
const Booking = db.bookings;
const Guest = db.guests;
const Room = db.rooms;
const { isRoomAvailable } = require("../utils/bookingAvailability");
const { handleError } = require("../utils/http");

const validateBookingDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return "check_in_date and check_out_date are required";
  if (new Date(checkOut) <= new Date(checkIn)) {
    return "check_out_date must be later than check_in_date";
  }
  return null;
};

exports.create = async (req, res) => {
  try {
    const { guestId, roomId, check_in_date, check_out_date } = req.body;

    const datesError = validateBookingDates(check_in_date, check_out_date);
    if (datesError) return res.status(400).json({ message: datesError });

    const guest = await Guest.findByPk(guestId);
    if (!guest) return res.status(400).json({ message: "Guest not found" });

    const room = await Room.findByPk(roomId);
    if (!room) return res.status(400).json({ message: "Room not found" });
    if (room.status === "maintenance") {
      return res.status(400).json({ message: "Room is in maintenance" });
    }

    const available = await isRoomAvailable(roomId, check_in_date, check_out_date);
    if (!available) {
      return res.status(400).json({ message: "Room is not available for selected dates" });
    }

    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    handleError(res, error, "Failed to create booking");
  }
};

exports.findAll = async (_req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [Guest, Room] });
    res.json(bookings);
  } catch (error) {
    handleError(res, error, "Failed to fetch bookings");
  }
};

exports.findOne = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: [Guest, Room] });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    handleError(res, error, "Failed to fetch booking");
  }
};

exports.update = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const checkIn = req.body.check_in_date || booking.check_in_date;
    const checkOut = req.body.check_out_date || booking.check_out_date;
    const roomId = req.body.roomId || booking.roomId;

    const datesError = validateBookingDates(checkIn, checkOut);
    if (datesError) return res.status(400).json({ message: datesError });

    if (req.body.guestId) {
      const guest = await Guest.findByPk(req.body.guestId);
      if (!guest) return res.status(400).json({ message: "Guest not found" });
    }

    const room = await Room.findByPk(roomId);
    if (!room) return res.status(400).json({ message: "Room not found" });

    const available = await isRoomAvailable(roomId, checkIn, checkOut, booking.id);
    if (!available) {
      return res.status(400).json({ message: "Room is not available for selected dates" });
    }

    await Booking.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update booking");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await Booking.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete booking");
  }
};
