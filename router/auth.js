const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const router = express.Router();

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello from server");
});

//Registration route
router.post("/register", async (req, res) => {
    const { name, email, password, storeName, address, mobileNo } = req.body;
    if (!name || !email || !password || !storeName || !address || !mobileNo) {
        return res.status(422).json({ error: "All fiels are required!" });
    }
    try {
        const userExist = await User.findOne({ email:email });

        if(userExist){
            return res.status(422).json({error : "E-Mail already registered!"});
        }

        const user = new User({ name, email, password, storeName, address, mobileNo });

        const userRegistered = await user.save();

        if(userRegistered){
            res.status(201).json({message: "Registration Succesfull!"})
        }else{
            res.status(500).json({error:"Registaration Failed!"});
        }
    }catch(err){
        console.log(err);
    }
});

//Signin route 
router.post('/signin', async (req, res) => {
    console.log(req.body);
    try{
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({message : "Email and password Required!"});
        }
        const userLogin = await User.findOne({ email:email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            });
            if(!isMatch){
                res.json({error: "Invalid Credentials"});
            }else{
                res.json({message: "user signin succesfull!"});
            }
        }else{
            res.json({error: "User Not Found"});
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
