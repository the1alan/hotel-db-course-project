module.exports = (db) => {
  db.roomTypes.hasMany(db.rooms, { foreignKey: "roomTypeId", onDelete: "RESTRICT" });
  db.rooms.belongsTo(db.roomTypes, { foreignKey: "roomTypeId" });

  db.guests.hasMany(db.bookings, { foreignKey: "guestId", onDelete: "RESTRICT" });
  db.bookings.belongsTo(db.guests, { foreignKey: "guestId" });

  db.rooms.hasMany(db.bookings, { foreignKey: "roomId", onDelete: "RESTRICT" });
  db.bookings.belongsTo(db.rooms, { foreignKey: "roomId" });

  db.bookings.hasMany(db.payments, { foreignKey: "bookingId", onDelete: "CASCADE" });
  db.payments.belongsTo(db.bookings, { foreignKey: "bookingId" });

  db.bookings.belongsToMany(db.services, {
    through: db.bookingServices,
    foreignKey: "bookingId",
    otherKey: "serviceId",
  });

  db.services.belongsToMany(db.bookings, {
    through: db.bookingServices,
    foreignKey: "serviceId",
    otherKey: "bookingId",
  });

  db.bookings.hasMany(db.bookingServices, { foreignKey: "bookingId", onDelete: "CASCADE" });
  db.bookingServices.belongsTo(db.bookings, { foreignKey: "bookingId" });

  db.services.hasMany(db.bookingServices, { foreignKey: "serviceId", onDelete: "CASCADE" });
  db.bookingServices.belongsTo(db.services, { foreignKey: "serviceId" });
};
