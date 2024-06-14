const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500
    err.message = err.message || "Internal server error"

    // wrong mongodb id error
    if(err.name === "CaseError"){
        const message = `Resource not found. Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    // Wrong JWT error
    if(err.naame === "JsonWebTokenError"){
        const message = `Json web token is expired, try again`
        err = new ErrorHandler(message, 400)
    }

    //JWT expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json web token is expired, try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statuscode).json({
        success: false,
        message: err.message
    })
}