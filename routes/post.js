const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");


router.get('/allPost', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post("/createPost", requireLogin, (req, res) => {
    const { title, body, pic } = req.body
    // console.log(req.body)
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please Add All The fields" })
    }
    //console.log(req.user)
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    }).catch(err => {
        console.log(err)
    })


})


router.get("/mypost", requireLogin, (req, res) => {
    console.log(req.user)
    Post.find({ postedBy: req.user._id })
        .populate("PostedBy", "_id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router