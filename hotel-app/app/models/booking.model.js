module.exports = (sequelize, Sequelize) => {
  return sequelize.define("booking", {
    check_in_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    check_out_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isAfterCheckIn(value) {
          if (new Date(value) <= new Date(this.check_in_date)) {
            throw new Error("check_out_date must be later than check_in_date");
          }
        },
      },
    },
    status: {
      type: Sequelize.ENUM("created", "confirmed", "checked_in", "checked_out", "cancelled"),
      allowNull: false,
      defaultValue: "created",
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  });
};
