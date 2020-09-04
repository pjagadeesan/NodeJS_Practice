const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
    hasErrors: false,
    errorMessage: message,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editing: false,
      hasErrors: !errors.isEmpty(),
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, price, description },
      validationErrors: errors.array(),
    });
  }

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then(() => {
      console.log('created product');
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        prods: products,
        path: '/admin/products',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  // this edit mode is redundant, just added to demonstrate how to use query param
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    //Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      product: { id: productId, title, imageUrl, price, description },
      validationErrors: errors.array(),
    });
  }

  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      console.log('PRODUCT DELETED');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
