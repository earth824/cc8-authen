const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const {
      username,
      password,
      confirmPassword,
      email,
      firstName,
      lastName,
      phoneNumber,
      gender
    } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'password did not match' });
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      phoneNumber,
      gender
    });

    res.status(201).json({ message: 'register successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username === undefined)
      return res.status(400).json({ message: 'username is required' });
    if (password === undefined)
      return res.status(400).json({ message: 'password is required' });

    const user = await User.findOne({ where: { username } });
    if (!user)
      return res
        .status(400)
        .json({ message: 'username or password incorrect' });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res
        .status(400)
        .json({ message: 'username or password incorrect' });

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: +process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({ token, message: 'login successfully' });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      return res.status(401).json({ message: 'you are unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) return res.status(400).json({ message: 'user not found' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.getUser = (req, res, next) => {
  res.status(200).json({ user: req.user, payload: req.payload });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!isOldPasswordCorrect)
      return res.status(400).json({ message: 'password is incorrect' });
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: 'password did not match' });
    const newHashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.BCRYPT_SALT
    );

    // await User.update(
    //   { password: newHashedPassword },
    //   { where: { id: req.user.id } }
    // );

    req.user.password = newHashedPassword;
    await req.user.save();

    res.status(200).json({ message: 'password changed successfully' });
  } catch (err) {
    next(err);
  }
};
