module.exports = (db) => {
  db.roomTypes.hasMany(db.rooms);
  db.rooms.belongsTo(db.roomTypes);

  db.guests.hasMany(db.bookings);
  db.bookings.belongsTo(db.guests);

  db.rooms.hasMany(db.bookings);
  db.bookings.belongsTo(db.rooms);

  db.bookings.hasMany(db.payments);
  db.payments.belongsTo(db.bookings);

  db.bookings.belongsToMany(db.services, {
    through: db.bookingServices,
  });

  db.services.belongsToMany(db.bookings, {
    through: db.bookingServices,
  });
};
