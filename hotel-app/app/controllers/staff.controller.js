const db = require("../models");
const Staff = db.staff;

exports.create = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff member not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Staff.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ message: "Staff member updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Staff.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Staff member not found" });

    res.json({ message: "Staff member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
