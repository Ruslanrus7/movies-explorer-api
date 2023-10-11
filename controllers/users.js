const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY = 'some-secret-key' } = process.env;
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const User = require('../models/user');

module.exports.editUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User not found'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    name,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(201).send({
          name: user.name, _id: user._id, email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError(err.message));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports.getDataUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User not found'));
      } else {
        next(err);
      }
    });
};
