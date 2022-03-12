const express = require("express")
const { body, validationResult } = require('express-validator');
const router = express.Router()
const { Posts } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get('/', async (req, res) => {
    const listOfPosts = await Posts.findAll()
    res.json(listOfPosts)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id)
    res.json(post)
})

router.delete('/',[
    body('PostId').not().isEmpty().withMessage("กรุณาใส่ชื่อ PostId มาด้วย"),
], validateToken, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    
    const { PostId } = req.body
    await Posts.destroy({
        where: {
            id: PostId
        }
    })
    res.json("Delete Post Successfully!");
})

router.post('/',[
    body('title').not().isEmpty().withMessage("กรุณาใส่ชื่อ Title"),
    body('postText').not().isEmpty().withMessage("กรุณากรอก postText")
], validateToken, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const post = req.body
    const username = req.user.username
    const id = req.user.id
    post.username = username
    post.UserId = id
    await Posts.create(post) 
    res.json(post) 
})

module.exports = router