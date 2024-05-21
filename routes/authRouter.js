const express = require('express')
const authRouter = express.Router()
const {signup, signin} = require('../controller/authController')

//signup
authRouter.post('/signup', signup)


// sign in
authRouter.post('/signin', signin)


module.exports = authRouter