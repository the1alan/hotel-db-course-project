module.exports = (sequelize, Sequelize) => {
  return sequelize.define("room", {
    number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    floor: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "available",
    },
  });
};
