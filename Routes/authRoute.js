const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../Middleware/requireLogin");

router.get("/users", requireLogin, async (req, res) => {
  try {
    const savedUsers = await User.find();
    res.json(savedUsers);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(422).json("Please enter all fields");
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json("User already exists");
    }
    const user = new User({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
    });
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json("Please enter all fields");
    }
    const savedUser = await User.findOne({ email: email });
    if (!savedUser) {
      return res.json("Wrong Credentials");
    }
    const exists = bcrypt.compareSync(password, savedUser.password);
    if (exists) {
      // res.json("Signed In Successfully");
      const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(422).json("Wrong Credentials");
    }
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
