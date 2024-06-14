const ErrorHandler = require('../utils/errorHandler')
const ProductModel = require('../models/productModel')
const userModel = require('../models/userModel')
const catchAsyncErrors = require('../middlewares/catchAsyncError')
const ApiFunctionalities = require('../utils/apiFunctionalities')
const cloudinary = require('cloudinary')

// Create product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    if (req.files) {
        if(Array.isArray(req.files.images)){
            images = req.files.images
        } else {
            images = [req.files.images]
        }
    }
    
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i].tempFilePath, {
        folder: "products",
        })

        imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
        })
    }

    req.body.size = JSON.parse(req.body.size)
    
    req.body.images = imagesLinks
    req.body.user = req.user._id

    const product = await ProductModel.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

// Update product --Admin
exports.updateProducts = catchAsyncErrors(async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    let images = []

    if (req.files) {
        if(Array.isArray(req.files.images)){
            images = req.files.images
        } else {
            images = [req.files.images]
        }
    }
    
    if (images.length !== 0) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
    
        const imagesLinks = [];
    
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i].tempFilePath, {
            folder: "products",
            })
    
            imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
            })
        }
    
        req.body.images = imagesLinks;
      }

      req.body.size = JSON.parse(req.body.size)

      product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new : true })

      res.status(200).json({
        success: true,
        product
      })
})

// Delete product --Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    // Deleting images from cloudinary
    for(let i=0; i<product.images.length; i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    
    await product.deleteOne()

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

// Get all product --Admin
exports.getAdminAllProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await ProductModel.find()

    res.status(200).json({
        success: true,
        products
    })
})

// Get all product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8
    
    const apiFunctionalities = new ApiFunctionalities(ProductModel.find(), req.query)
        .search()
        .filter()
        .searchCategory()
        .gender()
        .style()

    let [products, productsCount] = await Promise.all([
        apiFunctionalities.query,
        ProductModel.countDocuments()
    ])

    const filteredProductsCount = products.length

    apiFunctionalities.pagination(resultPerPage)
    products = await apiFunctionalities.query.clone()
    
    res.status(200).json({
        success: true,
        products,
        productsCount,
        filteredProductsCount
    })
})

// Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})

// Create product review or update a review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await ProductModel.findById(productId)

    const userReviewIndex = product.reviews.findIndex(
        rev => rev.user.toString() === req.user._id.toString()
    )

    if(userReviewIndex !== -1) {
        product.reviews[userReviewIndex].rating = rating;
        product.reviews[userReviewIndex].comment = comment;
    } else {
        product.reviews.push(review)
    }
    let sum = 0

    product.reviews.forEach((rev)=>{
        sum += rev.rating
    })

    product.ratings = sum/product.reviews.length
    
    await product.save({ validateBeforeSave: true })

    res.status(200).json({
        success: true,
        product
    })
})

// Delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await ProductModel.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    const reviews = product.reviews.filter((rev) => {
        rev._id.toString() !== req.query.id.toString()
    })

    let sum = 0
    let ratings = 0

    reviews.forEach((rev) => {
        sum += rev.rating
    })

    if(reviews.length === 0){
        ratings = 0
    } else {
        ratings = sum/reviews.length
    }

    await ProductModel.findByIdAndUpdate(req.query.productId, 
        {
            reviews,
            ratings
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    )

    res.status(200).json({
        success: true,
    })
})

// Get all reviews
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await ProductModel.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})