const express = require('express');
const router = express.Router();
const { updateEvent, createEvent, deleteEvent } = require("../controllers/event");

router.route('/update').post(updateEvent);

router.route('/create').post(createEvent);

router.route('/delete').post(deleteEvent);

module.exports = router;