const express = require('express');
const router = express.Router();
const { retrieve_user } = require("../controllers/profile");

router.route('/retrieve').post(retrieve_user);

module.exports = router;