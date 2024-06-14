const express = require('express')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const { 
    getAllOrders,
    changeOrderStatus,
    deleteOrder,
    myOrders,
    getSingleOrder,
    createOrder 
} = require('../controllers/orderController')

const router = express.Router()

// Admin
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)
router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), changeOrderStatus)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)


// User
router.route('/order/new').post(isAuthenticatedUser, createOrder)
router.route('/order/me').get(isAuthenticatedUser, myOrders)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)

module.exports = router