const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const fs = require("fs");
const checkInternetConnected = require("check-internet-connected");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});
router.get("/specific", (req, res) => {
  res.send("Specific post");
});

router.post("/", async (req, res) => {
  checkInternetConnected()
    .then((result) => {
      const post = new Post({
        title: req.body.title,
        description: req.body.description,
      });
      try {
        const savedPost = post.save();
        res.json(savedPost);
      } catch (err) {
        res.json({ message: err });
      }
    })
    .catch((ex) => {
      fs.readFile("myjson.json", "utf8", (err, data) => {
        if (err) throw err;
        var data = JSON.parse(data);
        data.requests.push(req.body);
        fs.writeFile("myjson.json", JSON.stringify(data), "utf-8", (err) => {
          if (err) throw err;
        });
      });
      res.json({ message: "err" });
    });
});

// router.post("/delete", (req, res) => {
//   Post.find({ title: req.body.id.replace(/\-/g, " ") }).deleteMany(
//     (err, data) => {
//       if (err) throw err;
//       res.json(data);
//     }
//   );
//   res.json(req.body);
// });

module.exports = router;
