module.exports = (sequelize, Sequelize) => {
  return sequelize.define("room_type", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    base_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });
};
