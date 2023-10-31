const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const router = express.Router();

require("../db/conn");
const User = require("../models/userSchema");

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
            res.status(500).json({
                success: false,
                message: 'User already exists !'
            })
        }

        const user = new User({ name, email, password, storeName, address, mobileNo });
    
        const userRegistered = await user.save();

        if(userRegistered){
            const token = await user.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 24*60*60*1000), //token valid for 24hrs
                httpOnly: true
            });
            console.log('cookie');
            user.password = undefined;
            res.status(200).json({
                success: true,
                message: 'User Registration successfully !',
                user
            });
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

//Signin route 
router.post('/signin', async (req, res) => {
    console.log(req.body);
    try{
        const { email, password } = req.body;
        
        if(!email || !password){
            res.status(500).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const userLogin = await User.findOne({ email:email});

        const isMatch = await bcrypt.compare(password, userLogin.password);

        
        if(isMatch){
            const token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 24*60*60*1000), //token valid for 24hrs
                httpOnly: true
            });

            //console.log(token);
            res.status(200).json({
                success: true,
                message: 'Logged in successfully !',
                userLogin
            })
        }else{
            res.status(500).json({
                success: false,
                message: 'Invalid Credentials !',
            })
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

router.get('/logout', () =>{
    try {
        res.cookie('token',null,{
            httpOnly: true,
            maxAge: 0 ,
            secure: true
        })

        res.status(200).json({
            success :true ,
            message: `User logged out successfully`
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})



module.exports = router;
