const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

const errormiddleware = require('./middlewares/error')

if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({path: "backend/.env"})
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

// Routes import
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const orderRoute = require('./routes/orderRoute')
const paymentRoute = require('./routes/paymentRoute')

// Routes
app.use('/api/backend/products', productRoute)
app.use('/api/backend/users', userRoute)
app.use('/api/backend/orders', orderRoute)
app.use('/api/backend/pay', paymentRoute)


app.use(express.static(path.join(__dirname, "../client/build")))

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
})


app.use(errormiddleware)

module.exports = app