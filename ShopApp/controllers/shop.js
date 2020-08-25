const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  // passing callback function to fetchAll to get the products once the readFile is done.
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      prods: products,
      path: '/products',
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, product => {
    res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' });
  });
};

exports.getIndex = (req, res, next) => {
  // passing callback function to fetchAll to get the products once the readFile is done.
  Product.fetchAll(products => {
    res.render('shop/index', {
      pageTitle: 'Shop',
      prods: products,
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      if (cart) {
        cart.products.forEach(cartItem => {
          const cartProductData = products.find(p => p.id === cartItem.id);
          cartProducts.push({ product: cartProductData, qty: cartItem.qty });
        });
      }
      res.render('shop/cart', { path: '/cart', pageTitle: 'Your Cart', products: cartProducts });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId.trim();
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.removeProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders' });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};
