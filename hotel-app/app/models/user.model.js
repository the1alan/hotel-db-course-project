module.exports = (sequelize, Sequelize) => {
  return sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("admin", "manager", "receptionist"),
      allowNull: false,
      defaultValue: "receptionist",
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
