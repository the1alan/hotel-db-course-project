const db = require("../models");
const Payment = db.payments;

exports.create = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Payment.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Payment.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Payment not found" });

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
