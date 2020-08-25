const path = require('path');
const fs = require('fs');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // get existing cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrie: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // find the product and update qty
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].qty++;
      } else {
        cart.products.push({ id, qty: 1 });
      }
      // update total price of the cart
      // the  '+' converts productPrice to number
      cart.totalPrie += +productPrice;
      // write updated cart to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static removeProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;

      const cart = JSON.parse(fileContent);
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);

      if (existingProductIndex > -1) {
        const prodQty = cart.products[existingProductIndex].qty;
        cart.products.splice(existingProductIndex, 1);
        cart.totalPrie -= productPrice * prodQty;
      }
      // write updated cart to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback(null);
      } else {
        const cart = JSON.parse(fileContent);
        callback(cart);
      }
    });
  }
};
