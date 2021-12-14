const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const errorMessage = (req, res, next) => {
  res.status(404).send({ message: 'Requested resource not found' });
  next();
};

app.use((req, res, next) => {
  req.user = {
    _id: '61a4bd75338cce5aefcf1c16',
  };
  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);
app.use('*', errorMessage);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
