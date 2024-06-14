const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')

// Get all orders --admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await orderModel.find()

    if(!orders){
        return next(new ErrorHandler("No orders found", 404))
    }

    let totalAmount = 0;

    orders.forEach((ord) => totalAmount += ord.totalPrice)

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

// Change order status --admin
exports.changeOrderStatus = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id)
    
    if(!order){
        return next(new ErrorHandler("Order not found", 404))
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        if(req.body.status === "Cancelled"){
            await Promise.all(order.orderItems.map(async (item) => {
                await updateStockforCancelling(item.productId, item.quantity, item.size, session)
            }))
        }
        
        order.orderStatus = req.body.status
    
        if(order.orderStatus === "Delivered"){
            order.deliveredAt = Date.now()
        }

        await order.save({ session })
    
        await session.commitTransaction()
        session.endSession()
    
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return next(error)
    }
})

async function updateStockforCancelling(id, quantity, sizeName, session){
    const product = await productModel.findById(id)
    if(product){
        product.size[sizeName] += Number(quantity)
        product.stock += Number(quantity)
        await product.save({ session, validateBeforeSave: false })
    } else {
        throw new ErrorHandler(`Product with ID ${id} not found`, 404)
    }
}

// Delete order --admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("Order not found ", 404));
    }

    await order.deleteOne()

    res.status(200).json({
        success: true,
    })
})


// Get logged in user orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await orderModel.find({user: req.user._id})
    
    res.status(200).json({
        success: true,
        orders
    })
})

// Get single order
exports.getSingleOrder =  catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Create order
exports.createOrder = catchAsyncError(async (req, res, next) => {
    try {
        req.body.shippingInfo = JSON.parse(req.body.shippingInfo)
        req.body.orderItems = JSON.parse(req.body.orderItems)
        req.body.paymentInfo = JSON.parse(req.body.paymentInfo)
    } catch (error) {
        console.log("executed error")
        return next(new ErrorHandler('Invalid JSON input', 400))
    }

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await Promise.all(orderItems.map(async (item) => {
            await updateStockforCreating(item.productId, item.quantity, item.size, session)
        }))
    
        const order = await orderModel.create([{
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user: req.user._id,
            paidAt: Date.now(),
        }], { session })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success: true,
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return next(error)
    }
})

async function updateStockforCreating(id, quantity, sizeName, session){
    const product = await productModel.findById(id)
    if(product){
        product.size[sizeName] -= Number(quantity)
        product.stock -= Number(quantity)
        if(product.size[sizeName]<0){
            throw new ErrorHandler(`Product out of stock`, 400)
        }
        await product.save({ session, validateBeforeSave: false })
    } else {
        throw new ErrorHandler(`Product with ID ${id} not found`, 404)
    }
}