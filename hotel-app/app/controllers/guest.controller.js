const db = require("../models");
const Guest = db.guests;

exports.create = async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const guests = await Guest.findAll();
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Guest.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.json({ message: "Guest updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Guest.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Guest not found" });

    res.json({ message: "Guest deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};