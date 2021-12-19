const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');

const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middleware/auth');
const limiter = require('./middleware/limiter');
const { createUser, login } = require('./controllers/users');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000, MONGODB } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

mongoose.connect(`${MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(limiter);
// request logger
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().alphanum(),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.get('*', (req, res) => {
  throw new NotFoundError('Requested resource not found');
});

// error logger
app.use(errorLogger);

app.use(errors());
// Central Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Server error :(' : message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${PORT}`);
});
