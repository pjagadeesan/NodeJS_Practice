const path = require('path');
const fs = require('fs');
const rootDir = require('../util/path');
const Cart = require('./cart');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = callback => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return callback([]);
    }
    callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      // let products = [];
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        products[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(products), err => {
          if (err) console.log(err);
        });
      } else {
        this.id = parseInt(Math.random() * 1000 + 1, 10).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          if (err) console.log(err);
        });
      }
    });
  }

  /**
   *
   * @param {*} callback - this callback function will be called when readFile is done
   * callback function passed by the controller
   */
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      callback(product);
    });
  }

  static deleteById(prodId) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === prodId);
      const updatedProducts = products.filter(p => p.id !== prodId);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        // eslint-disable-next-line no-console
        if (err) console.log(err);
        // Delete removed product from cart too
        Cart.removeProduct(prodId, product.price);
      });
    });
  }
};
