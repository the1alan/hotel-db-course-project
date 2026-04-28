const db = require("../models");
const bcrypt = require("bcryptjs");
const Staff = db.staff;
const { handleError } = require("../utils/http");

const sanitize = (item) => {
  if (!item) return item;
  const plain = item.toJSON ? item.toJSON() : item;
  delete plain.password_hash;
  return plain;
};

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.password_hash) {
      payload.password_hash = await bcrypt.hash(payload.password_hash, 10);
    }

    const created = await Staff.create(payload);
    res.status(201).json(sanitize(created));
  } catch (error) {
    handleError(res, error, "Failed to create staff");
  }
};

exports.findAll = async (_req, res) => {
  try {
    const rows = await Staff.findAll();
    res.json(rows.map(sanitize));
  } catch (error) {
    handleError(res, error, "Failed to fetch staff");
  }
};

exports.findOne = async (req, res) => {
  try {
    const row = await Staff.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Staff member not found" });
    res.json(sanitize(row));
  } catch (error) {
    handleError(res, error, "Failed to fetch staff");
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.password_hash) {
      payload.password_hash = await bcrypt.hash(payload.password_hash, 10);
    }

    const [count] = await Staff.update(payload, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Staff member not found" });
    res.json({ message: "Staff member updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update staff");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await Staff.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Staff member not found" });
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete staff");
  }
};
