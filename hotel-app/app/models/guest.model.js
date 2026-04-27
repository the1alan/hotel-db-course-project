module.exports = (sequelize, Sequelize) => {
  return sequelize.define("guest", {
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    passport_number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
