const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token ไม่ถูกส่งมา" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    // return res.status(200).json(payload);
    if (err) {
      return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }

    req.user = payload;
    next();
  });
};

module.exports = authToken;
