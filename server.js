const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const authRouter = require('./routes/authRouter')
const todoRouter = require('./routes/todoRouter')
const { expressjwt } = require('express-jwt')
require('dotenv').config()

app.use(express.json())
app.use(morgan('dev'))


const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (err) {
        console.log(err)
    }
}

connectToMongo()


app.use('/auth', authRouter)

app.use('/api', expressjwt({secret: process.env.SECRET, algorithms: ['HS256']}))

app.use('/api/todos', todoRouter)


app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnathourizedError') {
        res.status(err.status)
    }
    return res.send({ errMsg: err.message })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`)
})