const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  check('email')
    .trim()
    .custom(value => {
      return User.findOne({ where: { email: value } }).then(user => {
        if (!user) {
          return Promise.reject('Email does not exist');
        }
      });
    }),
  authController.postLogin
);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email')
      // to demonstrate custom validation
      .custom(value => {
        return User.findOne({ where: { email: value } }).then(user => {
          if (user) {
            return Promise.reject('Email already exist');
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only text and numbers and atleast 5 characters long'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match');
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get('/resetPassword', authController.getResetPassword);
router.post('/resetPassword', authController.postResetPassword);

router.get('/resetPassword/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
