const { Op } = require("sequelize");
const db = require("../models");
const Room = db.rooms;
const RoomType = db.roomTypes;
const Booking = db.bookings;
const { ACTIVE_BOOKING_STATUSES } = require("../utils/bookingAvailability");
const { handleError } = require("../utils/http");

exports.create = async (req, res) => {
  try {
    const roomType = await RoomType.findByPk(req.body.roomTypeId);
    if (!roomType) return res.status(400).json({ message: "Invalid roomTypeId" });

    const created = await Room.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    handleError(res, error, "Failed to create room");
  }
};

exports.findAll = async (_req, res) => {
  try {
    const rooms = await Room.findAll({ include: [{ model: RoomType }] });
    res.json(rooms);
  } catch (error) {
    handleError(res, error, "Failed to fetch rooms");
  }
};

exports.findAvailable = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "checkIn and checkOut are required" });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({ message: "checkOut must be later than checkIn" });
    }

    const conflicts = await Booking.findAll({
      attributes: ["roomId"],
      where: {
        status: { [Op.in]: ACTIVE_BOOKING_STATUSES },
        check_in_date: { [Op.lt]: checkOut },
        check_out_date: { [Op.gt]: checkIn },
      },
    });

    const busyRoomIds = [...new Set(conflicts.map((item) => item.roomId))];

    const where = { status: { [Op.ne]: "maintenance" } };
    if (busyRoomIds.length) {
      where.id = { [Op.notIn]: busyRoomIds };
    }

    const rooms = await Room.findAll({ where, include: [{ model: RoomType }] });
    res.json(rooms);
  } catch (error) {
    handleError(res, error, "Failed to fetch available rooms");
  }
};

exports.findOne = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, { include: [{ model: RoomType }] });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    handleError(res, error, "Failed to fetch room");
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.roomTypeId) {
      const roomType = await RoomType.findByPk(req.body.roomTypeId);
      if (!roomType) return res.status(400).json({ message: "Invalid roomTypeId" });
    }

    const [count] = await Room.update(req.body, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update room");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await Room.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete room");
  }
};
