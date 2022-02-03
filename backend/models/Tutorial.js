const mongoose = require("mongoose");

const tutorialSchema = mongoose.Schema({
    tutorialName: { type: String, unique: true, required: true },
    tutorialLink: { type: String, required: true },
    tutorialDescription: String,
    createdAt: Date
});

module.exports = mongoose.model("Tutorial", tutorialSchema)