const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please type your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please type your name"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be greater than 8 characters"],
        select: false
    },
    phone_no: {
        type: Number,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url:{
            type: String,
            default: "user"
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    addresses : [
        {
            name: {
                type: String,
                required: true,
            },
            phoneNo: {
                type: Number,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            postal_code: {
                type: Number,
                required: true,
            },
            street_address: {
                type: String,
                required: true,
            }
        }
    ],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// JWt token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function (){
    // generating token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 15*60*1000
    
    return resetToken
}


module.exports = mongoose.model("User", userSchema);