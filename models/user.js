const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: [true, 'поле email должно быть заполненно'],
    unique: true,
    validate: {
      validator: (text) => validator.isEmail(text),
      message: 'Ошибка валидации email',
    },
  },
  password: {
    type: String,
    required: [true, 'поле password должно быть заполнено'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'минимальная длина поля name - 2'],
    maxlength: [30, 'максимальная длина поля name - 30'],
    required: [true, 'поле name должно быть заполненно'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправельная почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправельная почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
