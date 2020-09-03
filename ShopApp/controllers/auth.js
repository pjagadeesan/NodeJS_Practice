const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: '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',
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ where: { email: email } })
    .then(user => {
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            req.flash('error', 'Invalid password');
            return res.redirect('/login');
          }
          req.session.isLoggedIn = true;
          req.session.userId = user.id;
          return req.session.save(err => {
            console.log(err);
            return res.redirect('/');
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      // new user creation
      return User.create({ email: email, password: hashedPassword });
    })
    .then(newUser => {
      newUser.createCart();
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'priya.laurel@gmail.com',
        subject: 'SignUp success',
        html: '<h1>You signed up successfully!</h1>',
      });
    })
    .catch(err => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  res.render('auth/password-reset', {
    path: '/resetPassword',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/resetPassword');
    }
    const token = buffer.toString('hex');
    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          req.flash('error', 'Email does not exist');
          return res.redirect('/resetPassword');
        }
        return user.update({ resetToken: token, resetTokenExpiration: Date.now() + 3600000 });
      })
      .then(result => {
        res.redirect('/login');
        return transporter.sendMail({
          to: email,
          from: 'priya.laurel@gmail.com',
          subject: 'Reset Password',
          html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>
        `,
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ where: { resetToken: token, resetTokenExpiration: { $gt: Date.now() } } })
    .then(user => {
      let message = req.flash('error');
      message = message.length > 0 ? message[0] : null;
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user.id,
        token,
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, token } = req.body;
  let resetUser;
  User.findOne({
    where: { id: userId, resetToken: token, resetTokenExpiration: { $gt: Date.now() } },
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      return resetUser.update({
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiration: undefined,
      });
    })
    .then(result => {
      return res.redirect('/login');
    })
    .catch(err => console.log(err));
};
