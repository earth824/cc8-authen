const express = require('express');
const userController = require('../controllers/userController');
const passport = require('passport');

const router = express.Router();

const authMid = passport.authenticate('jwt-user', { session: false });

router.post('/register', userController.register);
router.post('/login', userController.login);
// router.get('/', userController.protect, userController.getUser);
router.get('/', authMid, userController.getUser);
router.patch(
  '/change-password',
  userController.protect,
  userController.changePassword
);

module.exports = router;
