const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user.Models');


const userRouter = express.Router();



//register user routes
userRouter.post('/register', async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            res.status(400).send({ msg: 'User already exist, please login' })
        } else {
            bcrypt.hash(password, 3, async (err, hash) => {
                let user = UserModel({ name, email, gender, password: hash, age, city, is_married })
                await user.save();
                res.status(200).send({ msg: "Registration successful" })
            })
        }

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})



//login user

userRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    console.log(user._id)
    if (user) {

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                res.status(200).send({ msg: "Login successful", token: jwt.sign({ "userID": user._id }, 'Random') })
            } else {
                res.status(400).send({ msg: "login failed" })
                console.log(err)
            }
        })
    }


})

module.exports = userRouter
