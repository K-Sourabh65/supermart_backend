const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true,`Name is a required field`] ,
  },
  email: {
    type: String,
    trim: true,
    required: [true,`Email is a required field`] ,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [7,'Min length should be 7'],
  },
  storeName: {
    type: String,
    trim: true,
    required: [true,`StoreName is a required field`] ,
  },
  address: {
    type: String,
    trim: true,
    required: [true,`Address is a required field`] ,
  },
  mobileNo: {
    type: Number,
    trim: true,
    required: true,
  },
  /*tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],*/
});

//for hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = hashedPass = await bcrypt.hash(this.password, 12);
  }
  next();
});

//generating the JWT token 
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // this.tokens = this.tokens.concat({ token: token });
    // await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
