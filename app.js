require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to DB');
  });

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(requestLogger);
app.use(limiter);
app.use(express.json());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError('страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
