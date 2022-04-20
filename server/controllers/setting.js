const path = require('path');
const User = require("../models/User");
const DatauriParser = require("datauri/parser");
const asyncHandler = require("express-async-handler");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const parser = new DatauriParser();

// @route POST /setting/existing
// @desc Check if the custom url is in use by another user
// @access Private
exports.existing = asyncHandler(async (req, res) => {
    const { url } = req.body
    const existing = await User.find({ url })
    existing.length === 0 ? res.status(200).json() : res.status(200).json({ error: 'url already in use'})
})

// @route POST /setting/save
// @desc Save user settings
// @access Private
exports.saveSetting = asyncHandler(async (req, res) => {
    const { id, url, timezone, hours, days  } = req.body;
    await User.findOneAndUpdate({ _id: id }, { url, timezone, hours, days });
    res.status(200).send('success');  
})

// @route POST /setting/updateUrl
// @desc Update user url
// @access Private
exports.updateUrl = asyncHandler(async (req, res) => {
    const { _id, url } = req.body;
    await User.findOneAndUpdate({ _id }, { url })
    res.status(200).send('success')
})

// @route POST /setting/updateTimezone
// @desc Update user timezone
// @access Private
exports.updateTimezone = asyncHandler(async (req, res) => {
    const { _id, timezone } = req.body;
    await User.findOneAndUpdate({ _id }, { timezone})
    res.status(200).send('success')
})

// @route POST /setting/upload
// @desc Uploads user profile picture
// @access Private
exports.uploadImage = asyncHandler(async (req, res) => {
    if (req.user) {
        const { _id } = req.user;
        const file = dataUri(req).content;
        cloudinary.uploader.upload(file, { upload_preset: 'ej6mqpxy' })
        .then((response) => {
            User.findOneAndUpdate({ _id }, { picture: response.url }).then(() => res.status(200).send({ new_picture: response.url }))
        })
        .catch((err) => res.status(400).send(err.message))
    } else {
        const file = dataUri(req).content;
        cloudinary.uploader.upload(file, { upload_preset: 'ej6mqpxy' })
        .then((response) => {
            User.findOneAndUpdate({ _id: '6260732eb0da31b3258824d7' }, { picture: response.url }).then(() => res.status(200).send({ new_picture: response.url }))
        })
        .catch((err) => res.status(400).send(err.message))
    }
});


// @desc Convert buffer to base64
const dataUri = req => parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);