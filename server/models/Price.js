const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
    priceInCents: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

module.exports = Price = mongoose.model("price", priceSchema);