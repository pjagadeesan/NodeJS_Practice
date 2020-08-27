const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const { DH_NOT_SUITABLE_GENERATOR } = require('constants');

const app = express();

//view engine set up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // by default it will set to views folder already

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//serving static files like css, images
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.getError);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

let currentUser;

sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    //console.log(result);
    return User.findOrCreate({ where: { name: 'priya', email: 'priya@test.com' } });
  })
  .then(([user, created]) => {
    currentUser = user;
    console.log('User created! ' + user.getDataValue('name'));
    return user.getCart();
  })
  .then(cart => {
    //console.log(user);
    if (!cart) {
      currentUser.createCart();
    }
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
