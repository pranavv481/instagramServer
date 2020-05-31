const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");


router.get('/protected', requireLogin, (req, res) => {
    res.send("Hello user")
})


router.post('/signUp', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please Add All Fields" })
    }
    User.findOne({ email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(400).json({ error: "User already Exist" })
            }
            bcrypt.hash(password, 12).then(hashPassword => {
                const user = new User({
                    name,
                    email,
                    password: hashPassword
                })
                user.save()
                    .then(user => {
                        res.status(200).json({ message: "Saved successfully" })
                    }).catch(err => {
                        console.log(err)
                    })
            }).catch(err => {
                console.log(err)
            })
        })

})

router.post('/signIn', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please Add All Fields" })
    }
    User.findOne({ email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid User and Password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMAtch => {
                    if (doMAtch) {
                        // res.status(200).json({ message: "Successfully Login" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email } = savedUser
                        res.json({ token, user: { _id, name, email } })

                    }
                    else {
                        return res.status(422).json({ error: "Invalid User and Password" })
                    }
                }).catch(err => {
                    console.log(err)
                })

        }).catch(err => {
            console.log(err)
        })
})

module.exports = router