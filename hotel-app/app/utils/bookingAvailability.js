const { Op } = require("sequelize");
const db = require("../models");

const ACTIVE_BOOKING_STATUSES = ["created", "confirmed", "checked_in"];

exports.ACTIVE_BOOKING_STATUSES = ACTIVE_BOOKING_STATUSES;

exports.findConflictingBookings = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const where = {
    roomId,
    status: { [Op.in]: ACTIVE_BOOKING_STATUSES },
    check_in_date: { [Op.lt]: checkOut },
    check_out_date: { [Op.gt]: checkIn },
  };

  if (excludeBookingId) {
    where.id = { [Op.ne]: excludeBookingId };
  }

  return db.bookings.findAll({ where });
};

exports.isRoomAvailable = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const conflicting = await exports.findConflictingBookings(roomId, checkIn, checkOut, excludeBookingId);
  return conflicting.length === 0;
};
