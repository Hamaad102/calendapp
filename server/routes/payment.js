const express = require('express');
const router = express.Router();
const { checkout, success } = require("../controllers/payment");

router.route("/create-checkout-session").post(checkout);

router.route("/success").post(success);

module.exports = router;