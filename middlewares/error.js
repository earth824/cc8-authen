const error = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
      return res.status(401).json({ message: err.message });
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  } else {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
      return res.status(401).json({ message: 'you are unauthorized' });
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ message: 'you are unauthorized' });
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = error;
