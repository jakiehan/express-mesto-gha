const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { statusCode } = require('./utils/constants');

const { NOT_FOUND } = statusCode;

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '629ce9dee679d70fbe09ca46',
  };
  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'NOT FOUND' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
