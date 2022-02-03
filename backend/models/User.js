const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    company: {type: String, required: true, unique: true},
    isAdmin: Boolean,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    sector: {type: String, required: true}
})

module.exports = mongoose.model("User", userSchema)