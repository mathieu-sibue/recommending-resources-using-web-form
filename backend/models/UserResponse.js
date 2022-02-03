const mongoose = require("mongoose");

const singleResponseSchema = mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    response: { type: mongoose.Schema.Types.Mixed }       
})

const userResponseSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User' },   
    responses: [singleResponseSchema],
    createdAt: { type: Date },
    lastModified: [{ type: Date }]
})

module.exports = mongoose.model("UserResponse", userResponseSchema)

