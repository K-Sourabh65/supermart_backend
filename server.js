const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();

require("./db/conn");
app.use(express.json());
app.use(require("./router/auth"));
const port = process.env.PORT;

const user = require("./model/userSchema");

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server is Listnening on port ${port}`);
});
