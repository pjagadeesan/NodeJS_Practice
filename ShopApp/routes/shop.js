const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
// to get the index page
router.get('/', shopController.getIndex);
// GET all products
router.get('/products', shopController.getProducts);
// GET product by id
router.get('/products/:productId', shopController.getProduct);
// get the cart
router.get('/cart', shopController.getCart);
// for adding/posting product to cart
router.post('/cart', shopController.postCart);

router.post('/delete-cart-item', shopController.postDeleteProduct);

router.post('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;
