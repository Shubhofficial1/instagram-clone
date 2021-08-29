const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("MongoDB connected successfully");
});

const authRoute = require("./Routes/authRoute.js");
const postRoute = require("./Routes/postRoute.js");
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.get("/", (req, res) => {
  res.send("Home page");
});

const PORT = process.env.PORT || 5000;

app.listen("5000", () => {
  console.log(`Server has been running on port ${PORT}`);
});
