const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")
    if (!accessToken) return res.status(400).json({error: "ไม่มี Token ไอควาย!"})

    try {
        const validToken = verify(accessToken, "ITUNAHEEEEEEEEE")
        req.user = validToken
        if (validToken) return next()
    } catch (error) {
        return res.status(400).json({error: error})
    }
}

module.exports = {
    validateToken
}