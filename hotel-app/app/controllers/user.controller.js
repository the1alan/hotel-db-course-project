const db = require("../models");
const bcrypt = require("bcryptjs");
const { handleError } = require("../utils/http");

const User = db.users;

exports.create = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (!password) return res.status(400).json({ message: "password is required" });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ ...rest, password_hash });
    res.status(201).json({ id: user.id, email: user.email, role: user.role, full_name: user.full_name });
  } catch (error) {
    handleError(res, error, "Failed to create user");
  }
};

exports.findAll = async (_req, res) => {
  try {
    res.json(await User.findAll({ attributes: { exclude: ["password_hash"] } }));
  } catch (error) {
    handleError(res, error, "Failed to fetch users");
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password_hash"] } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    handleError(res, error, "Failed to fetch user");
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.password) {
      payload.password_hash = await bcrypt.hash(payload.password, 10);
      delete payload.password;
    }

    const [count] = await User.update(payload, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update user");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await User.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete user");
  }
};
