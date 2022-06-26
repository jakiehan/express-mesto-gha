const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/NotFound');
require('dotenv').config();

const { login, createUser } = require('./controllers/auth');
const auth = require('./middlewares/auth');

const { handleErrors } = require('./middlewares/errors');

const { codeStatus, regex } = require('./utils/constants');

const { INTERNAL_SERVER_ERROR } = codeStatus;
const { REG } = regex;

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REG),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFound('Not Found'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const error = handleErrors(err);
  const { statusCode = INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({ message: statusCode === INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
