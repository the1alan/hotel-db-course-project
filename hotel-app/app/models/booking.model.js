module.exports = (sequelize, Sequelize) => {
  return sequelize.define("booking", {
    check_in_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    check_out_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "created",
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  });
};
