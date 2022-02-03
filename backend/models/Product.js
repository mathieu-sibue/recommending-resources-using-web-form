const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productName: { type: String, unique: true, required: true },
    productLink: { type: String, unique: true, required: true },
    productDescription: String,
    productPhoto: String,                                   
    productPhotoFilename: String,
    tutorials: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' }
    ],
    createdAt: Date
});

module.exports = mongoose.model("Product", productSchema)