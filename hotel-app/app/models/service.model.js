module.exports = (sequelize, Sequelize) => {
  return sequelize.define("service", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });
};
