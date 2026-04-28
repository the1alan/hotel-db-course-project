const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "hotel_secret";

exports.verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden for this role" });
  }
  next();
};
