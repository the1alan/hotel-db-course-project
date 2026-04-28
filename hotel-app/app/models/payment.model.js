module.exports = (sequelize, Sequelize) => {
  return sequelize.define("payment", {
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    payment_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    method: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "paid", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
  });
};
