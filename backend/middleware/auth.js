const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const AuthenticationError = require('../errors/AuthenticationError');

// dotenv.config();
// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    throw new AuthenticationError('Authorization required');
  }

  req.user = payload;
  next();
};
