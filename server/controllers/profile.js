const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @route POST /profile/update
// @desc Allow user to update existing events
// @access Private
exports.retrieve_user = asyncHandler(async (req, res) => {
    const { url } = req.body;
    const user = await User.find({ url });
    if (user.length === 0) {
        res.status(404).send("This is awkward. That user doesn't exist. Are you sure you have the right link?");
    } else {
        const { _id, username, events, days, hours, timezone, picture } = user[0];
        res.status(200).send({ _id, username, events, days, hours, timezone, picture });
    }
})