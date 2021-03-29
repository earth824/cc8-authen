const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { username, password, confirmPassword, email, firstName, lastName, phoneNumber, gender } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: 'password did not match' });
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
    if (username === undefined) return res.status(400).json({ message: 'username is required' });
    if (password === undefined) return res.status(400).json({ message: 'password is required' });

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'username or password incorrect' });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ message: 'username or password incorrect' });

    res.status(200).json({ message: 'login successfully' });
  } catch (err) {
    next(err);
  }
};
