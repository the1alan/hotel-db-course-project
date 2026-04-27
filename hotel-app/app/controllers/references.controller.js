const db = require("../models");

const collections = {
  roomTypes: db.roomTypes,
  services: db.services,
  staff: db.staff,
};

const getModel = (entity) => collections[entity] || null;

exports.findAll = async (req, res) => {
  try {
    const [roomTypes, services, staff] = await Promise.all([
      db.roomTypes.findAll(),
      db.services.findAll(),
      db.staff.findAll(),
    ]);

    res.json({ roomTypes, services, staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findByEntity = async (req, res) => {
  try {
    const model = getModel(req.params.entity);

    if (!model) {
      return res.status(404).json({
        message: "Reference collection not found",
        availableCollections: Object.keys(collections),
      });
    }

    const entities = await model.findAll();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const model = getModel(req.params.entity);

    if (!model) {
      return res.status(404).json({
        message: "Reference collection not found",
        availableCollections: Object.keys(collections),
      });
    }

    const entity = await model.findByPk(req.params.id);

    if (!entity) {
      return res.status(404).json({ message: "Reference entity not found" });
    }

    res.json(entity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const model = getModel(req.params.entity);

    if (!model) {
      return res.status(404).json({
        message: "Reference collection not found",
        availableCollections: Object.keys(collections),
      });
    }

    const created = await model.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const model = getModel(req.params.entity);

    if (!model) {
      return res.status(404).json({
        message: "Reference collection not found",
        availableCollections: Object.keys(collections),
      });
    }

    const updated = await model.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Reference entity not found" });
    }

    res.json({ message: "Reference entity updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const model = getModel(req.params.entity);

    if (!model) {
      return res.status(404).json({
        message: "Reference collection not found",
        availableCollections: Object.keys(collections),
      });
    }

    const deleted = await model.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Reference entity not found" });
    }

    res.json({ message: "Reference entity deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
