const express = require('express')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')
const { 
    getAllUsers,
    getUserInfo,
    changeRole,
    deleteUser,
    registerUser,
    logInUser,
    logOutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateUserProfile,
    addAddress,
    editAddress,
    deleteAddress
 } = require('../controllers/userController')

const router = express.Router()

// Admin
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserInfo)
    .put(isAuthenticatedUser, authorizeRoles("admin"), changeRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

// User
router.route('/register').post(registerUser)
router.route('/login').post(logInUser)
router.route('/logout').get(logOutUser)
router.route('/user').get(isAuthenticatedUser, getUserDetails)
router.route('/user/update').put(isAuthenticatedUser, updateUserProfile)
router.route('/user/address').put(isAuthenticatedUser, addAddress)
router.route('/user/address/edit').put(isAuthenticatedUser, editAddress)
router.route('/user/address/delete').delete(isAuthenticatedUser, deleteAddress)
router.route('/user/password').put(isAuthenticatedUser, updatePassword)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

module.exports = router