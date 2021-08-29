const express = require("express");
const router = express.Router();
const Post = require("../Models/postModel");
const requireLogin = require("../Middleware/requireLogin");

router.get("/allposts", async (req, res) => {
  try {
    const allpost = await Post.find().populate("postedBy", "_id name");
    res.json(allpost);
  } catch (err) {
    res.json(err);
  }
});

router.get("/myposts", requireLogin, async (req, res) => {
  try {
    const mypost = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.json(mypost);
  } catch (err) {
    res.json(err);
  }
});

router.post("/createpost", requireLogin, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const post = new Post({
      title,
      body,
      postedBy: req.user,
    });
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
