const db = require("../models");
const Guest = db.guests;
const { handleError } = require("../utils/http");

exports.create = async (req, res) => {
  try {
    res.status(201).json(await Guest.create(req.body));
  } catch (error) {
    handleError(res, error, "Failed to create guest");
  }
};

exports.findAll = async (_req, res) => {
  try {
    res.json(await Guest.findAll());
  } catch (error) {
    handleError(res, error, "Failed to fetch guests");
  }
};

exports.findOne = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (error) {
    handleError(res, error, "Failed to fetch guest");
  }
};

exports.update = async (req, res) => {
  try {
    const [count] = await Guest.update(req.body, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Guest not found" });
    res.json({ message: "Guest updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update guest");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await Guest.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Guest not found" });
    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete guest");
  }
};
