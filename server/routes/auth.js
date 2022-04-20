const express = require('express');
const router = express.Router();
const { passportProtect } = require("../middleware/auth");
const {
  loadUser,
  demoUser,
  logoutUser,
  googleAuth,
  googleRedirect
} = require("../controllers/auth");

router.route("/user").get(passportProtect, loadUser);

router.route("/demo").get(demoUser);

router.route("/logout").get(logoutUser);

router.route('/google').get(googleAuth);

router.route('/google/redirect').get(googleRedirect);

module.exports = router;