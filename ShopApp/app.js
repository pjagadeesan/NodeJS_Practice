const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');

const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/errors');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const csrfProtection = csrf();

//view engine set up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // by default it will set to views folder already

app.use(bodyParser.urlencoded({ extended: false }));
//serving static files like css, images
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'My secret',
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    proxy: true,
  })
);

app.use(csrfProtection);
// for flashing messages to views through request object
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findByPk(req.session.userId)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => next(new Error(err)));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

//Error Handler
app.use((error, req, res, next) => {
  //res.status(error.httpStatusCode).render('/500');
  //res.redirect('/500');
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// Defining order relations for checkout flow
User.hasMany(Order);
Order.belongsTo(User);
//Order.hasMany(OrderItem);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
