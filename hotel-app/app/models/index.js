const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.roomTypes = require("./roomType.model.js")(sequelize, Sequelize);
db.rooms = require("./room.model.js")(sequelize, Sequelize);
db.guests = require("./guest.model.js")(sequelize, Sequelize);
db.bookings = require("./booking.model.js")(sequelize, Sequelize);
db.payments = require("./payment.model.js")(sequelize, Sequelize);
db.services = require("./service.model.js")(sequelize, Sequelize);
db.bookingServices = require("./bookingService.model.js")(sequelize, Sequelize);
db.staff = require("./staff.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);

require("./references.model.js")(db);

module.exports = db;
