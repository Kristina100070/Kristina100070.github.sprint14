/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
const express = require('express');
// const path = require('path')
const router = require('./routes');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', router);
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  const status = err.status || 500;
  let { message } = err;
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'validation error' });
  }
  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err.stack || err);
    message = 'unexpected error';
  }
  res.status(status).send(message);
});
