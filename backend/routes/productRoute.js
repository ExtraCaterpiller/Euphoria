const express = require('express')
const router = express.Router()
const {
    getAdminAllProducts, 
    getAllProducts,
    createProduct,
    updateProducts,
    deleteProduct,
    getProductDetails,
    getSimilarProducts,
    createProductReview,
    deleteReview,
    getAllReviews
} = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')


// Admin
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminAllProducts)
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)
router
    .route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProducts)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)


// Normal users
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getProductDetails)
router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(getAllReviews).delete(isAuthenticatedUser, deleteReview)


module.exports = router