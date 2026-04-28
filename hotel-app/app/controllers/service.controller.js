const db = require("../models");
const Service = db.services;
const { handleError } = require("../utils/http");

exports.create = async (req, res) => {
  try {
    res.status(201).json(await Service.create(req.body));
  } catch (error) {
    handleError(res, error, "Failed to create service");
  }
};

exports.findAll = async (_req, res) => {
  try {
    res.json(await Service.findAll());
  } catch (error) {
    handleError(res, error, "Failed to fetch services");
  }
};

exports.findOne = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    handleError(res, error, "Failed to fetch service");
  }
};

exports.update = async (req, res) => {
  try {
    const [count] = await Service.update(req.body, { where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update service");
  }
};

exports.delete = async (req, res) => {
  try {
    const count = await Service.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete service");
  }
};
