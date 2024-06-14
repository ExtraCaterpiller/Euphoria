const ErrorHandler = require('../utils/errorHandler')
const userModel = require('../models/userModel')
const sendToken = require('../utils/jwtToken')
const catchAsyncErrors = require('../middlewares/catchAsyncError')
const cloudinary = require('cloudinary')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const { ObjectId } = require('mongodb')


// Get all users --admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await userModel.find()
    if(!users){
        return next(new ErrorHandler("No user found", 404))
    }

    res.status(200).json({
        success: true,
        users
    })
})

// Get user info --admin
exports.getUserInfo = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler("No user found", 404))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// change role --admin
exports.changeRole = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.params.id)
    
    if(!user){
        return next(new ErrorHandler("No user found", 404))
    }
    
    user.role = req.body.role
    await user.save()
    
    const loginLink  = `${req.protocol}://${req.get("host")}/login`
    const message = `
    Hi ${user.name},

    We are excited to inform you that your account role has been updated to Admin at EUPHORIA.

    As an Admin, you now have access to additional features and capabilities, including:

    - Managing User Accounts: View and manage all user accounts.
    - Product Management: Add, edit, and remove products from our catalog.
    - Order Management: Oversee and process customer orders.
    - Analytical Tools: Access advanced reports and analytics to help drive our business forward.

    To get started with your new admin privileges, simply log in to your account using the link below:
    ${loginLink}

    If you have any questions about your new role or need assistance, our support team is here to help. You can reach us at ${process.env.SMTP_MAIL}.

    Thank you for your continued support and contribution to EUPHORIA. We look forward to achieving great things together!

    Best regards,
    The EUPHORIA Team
    `

    try{
        await sendEmail({
            email: user.email,
            subject: "Your Role Has Been Updated to Admin",
            message,
        })
    } catch(e) {
        return next(new ErrorHandler(e.message, 500))
    }
    
    res.status(200).json({
        success: true
    })
})

// delete user --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler("User does not exist", 404))
    }

    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)

    await user.deleteOne()

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const avatar = req.files.avatar
    const myCloud = await cloudinary.v2.uploader.upload(avatar.tempFilePath, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    })
    
    const {name, email, password} = req.body

    const user = await userModel.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    
    const loginLink = `${req.protocol}://${req.get("host")}/login`

    const message = `
    Hi ${name.trim()},

    Thank you for registering with EUPHORIA! We're thrilled to have you on board and can't wait for you to explore all the amazing products and deals we have in store.
    
    Here's what you can do next:

    - Browse Our Collections: Discover a wide range of products tailored to your needs.
    - Exclusive Offers: Keep an eye on your inbox for special discounts and offers.
    - Personalized Recommendations: Get suggestions based on your preferences and past purchases.

    To get started, simply log in to your account using the link below:
    ${loginLink}

    If you have any questions or need assistance, our customer support team is here to help. You can reach us at ${process.env.SMTP_MAIL}

    Welcome to the EUPHORAI community!

    Best regards,
    The EUPHORIA Team
    `

    try{
        await sendEmail({
            email: email,
            subject: "WELCOME TO EUPHORIA",
            message,
        })
    } catch(e) {
        return next(new ErrorHandler(e.message, 500))
    }

    sendToken(user, 201, res)
})

// Login user
exports.logInUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await userModel.findOne({email}).select("+password")
    
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res)
})


// LogOut
exports.logOutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({ valiateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, please ignore it.`

    try{
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch(e) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(e.message, 500))
    }
})

// Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
})

// Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)

    res.status(200).json({
        success: true,
        user,
    })
})

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).select("+password")
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old passwrod is incorrect", 400))
    }

    if(!req.body.newPassword || !req.body.confirmPassword){
        return next(new ErrorHandler("Please enter your password", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }
    
    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res);
})

// Update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phoneNo
    }
    
    if(req.files !== null && req.files.avatar){
        const user = await userModel.findById(req.user._id)

        const imageId = user.avatar.public_id

        await cloudinary.v2.uploader.destroy(imageId)

        const avatar = req.files.avatar
        const myCloud = await cloudinary.v2.uploader.upload(avatar.tempFilePath, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        })

        newData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await userModel.findByIdAndUpdate(req.user._id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        user,
    })
})

// Add address
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
    const { city, country, postal_code, street_address, name, phoneNo } = req.body

    const newAddress = {
        name: name,
        phoneNo: Number(phoneNo),
        country: country,
        city: city,
        postal_code: Number(postal_code),
        street_address: street_address
    }

    const user = await userModel.findById(req.user._id)
    user.addresses.push(newAddress)

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        user
    })
})

// Edit address
exports.editAddress = catchAsyncErrors(async (req, res, next) => {
    const { city, country, postal_code, street_address, name, phoneNo, id } = req.body
    
    const objectId = ObjectId.createFromHexString(id)
    const user = await userModel.findById(req.user._id)
    
    user.addresses.map(addr=>{
        if(addr._id.equals(objectId)){
            addr.city = city,
            addr.country = country,
            addr.name = name,
            addr.phoneNo = phoneNo,
            addr.postal_code = postal_code,
            addr.street_address = street_address
        }
    })

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        user,
    })
})

// Delete Address
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body
    
    const objectId = ObjectId.createFromHexString(id)
    const user = await userModel.findById(req.user._id)

    user.addresses = user.addresses.filter(addr => !addr._id.equals(objectId))

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        user,
    })
})