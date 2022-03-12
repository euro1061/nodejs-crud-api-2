const express = require("express")
const { body, validationResult } = require('express-validator');
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post('/signup',[
    body('username').not().isEmpty().withMessage("กรุณากรอก Username"),
    body('password').not().isEmpty().withMessage("กรุณากรอก Password")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const {username , password} = req.body
    const user = await Users.findOne({ where: {username: username}})
    if(user !== null) return res.status(400).json({error: "Username has in database please use other name."})

    await bcrypt.hash(password, 10).then(hash => {
        Users.create({
            username: username,
            password: hash
        })
    })
    res.json("Success signup!")
})

router.post('/signin',[
    body('username').not().isEmpty().withMessage("กรุณากรอก Username"),
    body('password').not().isEmpty().withMessage("กรุณากรอก Password")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const {username , password} = req.body
    const user = await Users.findOne({ where: {username: username}})
    if (!user) return res.status(400).json({error: "User not found!"})

    bcrypt.compare(password, user.password).then(match => {
        if(!match) return res.status(400).json({error: "Wrong Username And Password Combination"})

        const accessToken = sign({username: user.username, id: user.id},"ITUNAHEEEEEEEEE")
        res.json(accessToken);
    })
})


router.put('/changepassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Users.findOne({
        where: {
            username: req.user.username
        }
    })
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if(!match) return res.status(400).json({error: "Wrong Password Entered!"})

        bcrypt.hash(newPassword, 10).then(async (hash) => {
            await Users.update({password: hash}, {
                where: {
                    username: req.user.username
                }
            })
            res.json("Change Password Successfully!")
        })
    })
})

module.exports = router