const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();
// const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const AuthenticationError = require('../errors/AuthenticationError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash }))
    .then((user) => res.status(201).send({ _id: user.id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('The email and password are required');
      } else if (err.name === 'MongoServerError') {
        throw new ConflictError('Something went wrong');
      }
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('the user was no found');
      }
    })
    .catch(next);
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      runValidators: true,
      new: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
