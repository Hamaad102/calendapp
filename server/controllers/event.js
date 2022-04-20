const { v4: uuidv4 } = require('uuid');
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @route POST /event/update
// @desc Allow user to update existing events
// @access Private
exports.updateEvent = asyncHandler(async (req, res) => {
    const { _id, oldEvent, newEvent } = req.body;
    let userInfo = await User.find({ _id });
    let events = userInfo[0].events;
    let eventIndex = events.indexOf(oldEvent);
    if (eventIndex !== -1) {
        events[eventIndex] = newEvent;
        await User.findOneAndUpdate({ _id }, { events });
        res.status(200).send({ events });
    } else {
        res.status(409).send({ message: 'This event does not exist'});
    }
})


// @route POST /event/create
// @desc Allow premium users to crew new events
// @access Private
exports.createEvent = asyncHandler(async (req, res) => {
    const { _id, newEvent } = req.body;
    const info = await User.find({ _id });
    const completeEvent = `${newEvent}/${uuidv4()}`;

    let events = info[0].events;
    events.push(completeEvent);

    await User.findOneAndUpdate({ _id }, { events });
    res.status(200).send({ events });
})

// @route POST /event/delete
// @desc Allow users to delete events
// @access Private
exports.deleteEvent = asyncHandler(async (req, res) => {
    const { _id, deleteEvent } = req.body;
    const info = await User.find({ _id });

    let events = info[0].events;
    events = events.filter(event => event !== deleteEvent);

    await User.findOneAndUpdate({ _id }, { events });
    res.status(200).send({ events });
})