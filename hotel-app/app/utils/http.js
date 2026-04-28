exports.handleError = (res, error, fallback = "Internal server error") => {
  if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ message: error.errors?.[0]?.message || error.message });
  }

  return res.status(500).json({ message: error.message || fallback });
};
