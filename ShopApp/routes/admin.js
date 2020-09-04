const express = require('express');
const { check, body } = require('express-validator/check');

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
router.post(
  '/add-product',
  [
    body('title').trim().not().isEmpty().withMessage('Please enter a title'),
    check('imageUrl').trim().not().isEmpty().withMessage('Please add an image url'),
    check('price').trim().not().isEmpty().withMessage('Please enter the price'),
    check('description').trim().not().isEmpty().withMessage('Please add description'),
  ],
  adminController.postAddProduct
);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title').trim().not().isEmpty().isString().withMessage('Please enter a valid title'),
    check('imageUrl').trim().isURL().withMessage('Please enter a valid url'),
    check('price').trim().not().isEmpty().withMessage('Please enter the price'),
    check('description').trim().not().isEmpty().withMessage('Please add description'),
  ],
  adminController.postEditProduct
);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
