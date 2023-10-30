const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required:true
    },
    catagory:{
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        required:true
    },
    unit:{
        type: "String",
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model("PRODUCT", productSchema);

module.exports = Product;