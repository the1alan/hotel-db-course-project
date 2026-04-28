const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { handleError } = require("../utils/http");

const User = db.users;
const JWT_SECRET = process.env.JWT_SECRET || "hotel_secret";

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { email, password, role, full_name } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "email, password and full_name are required" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, role: role || "receptionist", full_name });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      token: signToken(user),
    });
  } catch (error) {
    handleError(res, error, "Failed to register user");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: signToken(user),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to login");
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password_hash"] } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    handleError(res, error, "Failed to fetch current user");
  }
};
