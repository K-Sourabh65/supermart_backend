const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello from server");
});
var hashedPass = "";
router.post("/register", async (req, res) => {
    const { name, email, password, storeName, address, mobileNo } = req.body;
    if (!name || !email || !password || !storeName || !address || !mobileNo) {
        return res.status(422).json({ error: "All fiels are required!" });
    }
    try {
        hashedPass = await bcrypt.hash(password, 10);
        // console.log(hashedPass);
        const userExist = await User.findOne({ email:email });

        if(userExist){
            return res.status(422).json({error : "E-Mail already registered!"});
        }

        const user = new User({name:name, email:email, password:hashedPass, storeName:storeName, address:address, mobileNo:mobileNo});

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

module.exports = router;
