const passport = require("passport");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @route GET /auth/user
// @desc Get user data with valid token
// @access Private
exports.loadUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ serviceid: req.user.serviceid });
  if (!user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const { premium, stripeid, hours, days, url, username, email, picture, serviceid, strategy, events, schedule, timezone } = user
  res.status(200).json({
    success: {
      user: {
        premium,
        stripeid,
        hours,
        days,
        url,
        username,
        email,
        picture,
        serviceid,
        strategy,
        mongoid: user._id,
        events,
        schedule,
        timezone,
      },
    },
  });
});

// @route GET /auth/demo
// @desc Get demo user data
// @access Private
exports.demoUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: '6260732eb0da31b3258824d7' })
  
  const { premium, stripeid, hours, days, url, username, email, picture, serviceid, strategy, events, schedule, timezone } = user
  res.status(200).json({
      user: {
        premium,
        stripeid,
        hours,
        days,
        url,
        username,
        email,
        picture,
        serviceid,
        strategy,
        mongoid: user._id,
        events,
        schedule,
        timezone,
      },
  });
})

// @route GET /auth/logout
// @desc Logout user
// @access Public
exports.logoutUser = asyncHandler(async (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("You have successfully logged out");
});

// @route GET /auth/google
// @desc Authorize user and obtain credentials
// @access Public
exports.googleAuth = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events', 'email'],
  accessType: 'offline'
})

// @route GET /auth/google/redirect
// @desc Redirect user to either a success or failure screen
// @access Public
exports.googleRedirect = passport.authenticate('google', {
  failureMessage: 'Cannot login to Google, please try again later',
  failureRedirect: `${process.env.CLIENT}/login/error`,
  successRedirect: `${process.env.CLIENT}`
}), (req, res) => {
  res.status(201);
}