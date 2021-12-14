const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password!'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Incorrect email or password!'));
      }
      const token = jwt.sign(
        { _id: req._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      // res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
      res.header('authorization', `Bearer ${token}`);
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash }))
    .then((user) => res.status(201).send({ _id: user.id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'The email or password you provided are invalid' });
      } else if (err.name === 'MongoServerError') {
        res.status(409).send({ message: 'user already created on the server' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error('No users were found');
      error.statusCode = 404;
      throw error;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id === 'me' ? req.user._id : req.params.id)
    // User.findById(req.params.id)
    .select('+password')
    .then((user) => {
      if (user) {
        console.log('user: ', user._id);
        res.send({ data: user });
      } else {
        return Promise.reject(new Error('no user was found'));
      }
    })
    .catch((err) => res.send({ message: err.message }));
};

// const getUserById = (req, res) => {
//   User.findById(req.params.id)
//     .orFail(() => {
//       const error = new Error('This user was not found');
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((user) => res.status(200).send({ data: user }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send({ message: 'Invalid user id' });
//       } else if (err.statusCode === 404) {
//         res.status(404).send({ message: err.message });
//       } else {
//         res
//           .status(500)
//           .send({ message: 'An error has occurred on the server' });
//       }
//     });
// };

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
