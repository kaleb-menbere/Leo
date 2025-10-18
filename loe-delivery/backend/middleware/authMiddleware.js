// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const verifyOptions = {
      algorithms: ["HS256"],
    };
    if (process.env.JWT_ISSUER) verifyOptions.issuer = process.env.JWT_ISSUER;
    if (process.env.JWT_AUDIENCE) verifyOptions.audience = process.env.JWT_AUDIENCE;

    const decoded = jwt.verify(token, process.env.JWT_SECRET, verifyOptions);
    req.user = decoded; // attach userId and role
    next();
  } catch (err) {
    if (err && err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
