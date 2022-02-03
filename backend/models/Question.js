const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    questionText: {type: String, unique: true, required: true},
    theme: {type: String, required: true},
    products: [                  // A check was added in the Admin interface of the front so that a tutorial and/or a product is always necessarily linked to a question of the form 
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    tutorials: [ 
        { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' }
    ],
    order: Number,
    createdAt: Date
});

module.exports = mongoose.model("Question", questionSchema)