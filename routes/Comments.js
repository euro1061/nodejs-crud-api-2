const express = require("express")
const { body, validationResult } = require('express-validator');
const router = express.Router()
const { Comments } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get('/:postId', async (req, res) => {
    const postId = req.params.postId
    const postComments = await Comments.findAll({ where: { PostId: postId } })
    res.json(postComments)
})

router.post('/', [
    body('commentBody').not().isEmpty().withMessage("กรุณากรอก Comment"),
], validateToken, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const comment = req.body
    const username = req.user.username
    comment.username = username
    await Comments.create(comment)
    res.json(comment)
})

router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId

    Comments.destroy({
        where: {
            id: commentId
        }
    })
    res.json("Delete Successfully!")
})

module.exports = router