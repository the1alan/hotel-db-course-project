const db = require("../models");
const RoomType = db.roomTypes;
const { handleError } = require("../utils/http");

exports.create = async (req, res) => {
  try {
    const created = await RoomType.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    handleError(res, error, "Failed to create room type");
  }
};

exports.findAll = async (_req, res) => {
  try {
    res.json(await RoomType.findAll());
  } catch (error) {
    handleError(res, error, "Failed to fetch room types");
  }
};

exports.findOne = async (req, res) => {
  try {
    const entity = await RoomType.findByPk(req.params.id);
    if (!entity) return res.status(404).json({ message: "Room type not found" });
    res.json(entity);
  } catch (error) {
    handleError(res, error, "Failed to fetch room type");
  }
};

exports.update = async (req, res) => {
  try {
    const [count] = await RoomType.update(req.body, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Room type not found" });
    res.json({ message: "Room type updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update room type");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await RoomType.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Room type not found" });
    res.json({ message: "Room type deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete room type");
  }
};
