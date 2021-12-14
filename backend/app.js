const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

const auth = require('./middlewares/auth');
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

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.post('/signin', login);

app.post('/signup', createUser);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
