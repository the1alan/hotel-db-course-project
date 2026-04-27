module.exports = (sequelize, Sequelize) => {
  return sequelize.define("staff", {
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    salary: {
      type: Sequelize.DECIMAL(10, 2),
    },
  });
};
