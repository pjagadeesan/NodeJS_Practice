const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie', 'loggedIn = true; Max-Age=10');
  User.findByPk(1)
    .then(user => {
      req.session.userId = user.id;
      req.session.isLoggedIn = true;
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  //res.setHeader('Set-Cookie', 'loggedIn = true; Max-Age=10');
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};