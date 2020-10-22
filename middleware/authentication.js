const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    res.status(404).json({
      message: "Tidak ada token",
    });

    return;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "nectar23@application.com");
  } catch (err) {
    res.status(500).json({ message: err });
  }

  if (!decodedToken) {
    res.status(400).json({
      message: "Tidak ter-authentikasi",
    });
  }

  req.userId = decodedToken.userId;
  next();
};
