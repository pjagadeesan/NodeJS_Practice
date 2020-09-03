const express = require('express');

// const rootDir = require('../util/path');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
//Adding middleware to all admin routes to check whether user is authenticated for the page
router.use(isAuth);

// admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
// admin/products => GET
router.get('/products', adminController.getProducts);
// admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
