const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const NotFoundError = require('./errors/NotFoundError');
const ServerError = require('./errors/ServerError');

const auth = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.get('*', (req, res) => {
  throw new NotFoundError('Requested resource not found');
  // res.status(404).send({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // check the status and display a message based on it
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
