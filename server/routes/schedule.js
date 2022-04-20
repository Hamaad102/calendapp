const express = require('express');
const router = express.Router();
const { ownerSchedule, bookMeeting, deleteMeeting, meetingInfo } = require("../controllers/schedule");

router.route('/retrieve').post(ownerSchedule);

router.route('/book').post(bookMeeting);

router.route('/delete').post(deleteMeeting);

router.route('/meeting').post(meetingInfo);

module.exports = router;