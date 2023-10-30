const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

require("../db/conn");
const Product = require("../models/productSchema");

router.post("/add_products", async (req, res) =>{
    const { productId, productName, catagory, quantity, unit, price } = req.body;
    if( !productId || !productName || !catagory || !quantity || !unit || !price){
        return res.status(422).json({ error: "All fiels are required!" });
    }
    try{
        //console.log(req.body);
        const productExist = await Product.findOne({ productName: productName});
        
        if(productExist){
            res.status(422).json({
                success: false,
                error: "produxt already exist"
            });
        }

        const product = new Product({productId, productName, catagory, quantity, unit, price});
        
        const addProduct = await product.save();
        
        if(addProduct){
            res.status(201).json({
                success: true,
                message: 'Product added Succesfully !'
            })
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

module.exports = router;