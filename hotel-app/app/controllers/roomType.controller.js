const db = require("../models");
const RoomType = db.roomTypes;

exports.create = async (req, res) => {
  try {
    const roomType = await RoomType.create(req.body);
    res.status(201).json(roomType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const roomTypes = await RoomType.findAll();
    res.json(roomTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const roomType = await RoomType.findByPk(req.params.id);
    if (!roomType) return res.status(404).json({ message: "Room type not found" });
    res.json(roomType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await RoomType.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Room type not found" });
    }

    res.json({ message: "Room type updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await RoomType.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Room type not found" });

    res.json({ message: "Room type deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
