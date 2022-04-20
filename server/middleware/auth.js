exports.passportProtect = (req, res, next) => {
  if (!req.isAuthenticated()) {
      return res.status(401).send("No token, authorization denied");
  }
  next();
};
