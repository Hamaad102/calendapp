const express = require('express');
const router = express.Router();
const { existing, saveSetting, updateUrl, updateTimezone, uploadImage } = require("../controllers/setting");

const multer = require('multer');
const upload = multer();

router.route('/existing').post(existing);

router.route('/save').post(saveSetting);

router.route('/updateUrl').post(updateUrl);

router.route('/updateTimezone').post(updateTimezone);

router.route('/picture/upload').post(upload.single('file'), uploadImage);

module.exports = router;