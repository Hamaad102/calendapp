const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      unique: true,
  },
  email: {
      type: String,
      required: true,
      unique: true,
  },
  strategy: {
      type: String,
      required: true,
  },
  serviceid: {
      type: String,
      required: false,
  },
  picture: {
      type: String,
      required: false,
  },
  refreshToken: {
      type: String,
      required: false,
  },
  premium: {
      type: Boolean,
      default: false,
  },
  stripeid: {
      type: String,
      unique: true,
      default: '',
  },
  url: {
    type: String,
    required: false,
    default: '',
  },
  timezone: {
    type: String,
    required: false,
    default: '',
  },
  hours: {
    type: Array,
    required: false,
  },
  days: {
    type: Array,
    required: false,
  },
  events: {
    type: Array,
    required: true,
    default: [`15/#7900ff/One-on-one/${uuidv4()}`, `30/#89b800/One-on-one/${uuidv4()}`, `60/#ff7000/One-on-one/${uuidv4()}`]
  },
  schedule: {
    type: Array,
    required: false,
    default: [], 
  },
  register_date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = User = mongoose.model("users", userSchema);
