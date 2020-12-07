import express from 'express'
import http from 'http'
import morgan from 'morgan'
import router from './router'
import mongoose from 'mongoose'
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/auth', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
 })

app.use(morgan('combined'))
app.use(express.json())

router(app)

const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on: ', port)
