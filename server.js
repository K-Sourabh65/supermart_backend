const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();

require("./db/conn");
app.use(express.json());
app.use(require("./routes/userAuth"));
app.use(require("./routes/addProducts"));

const port = process.env.PORT;

const user = require("./models/userSchema");
const product = require("./models/productSchema");

app.get("/users", (req, res) => {
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server is Listnening on port ${port}`);
});
