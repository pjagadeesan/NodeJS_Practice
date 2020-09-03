const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
// to get the index page
router.get('/', shopController.getIndex);
// GET all products
router.get('/products', shopController.getProducts);
// GET product by id
router.get('/products/:productId', shopController.getProduct);
// get the cart
router.get('/cart', isAuth, shopController.getCart);
// for adding/posting product to cart
router.post('/cart', isAuth, shopController.postCart);

router.post('/delete-cart-item', isAuth, shopController.postDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;
