const mongoose = require('mongoose');
const urlRegular = require('../utils/constans');

const movieSchema = new mongoose.Schema({

  country: {
    type: String,
    required: [true, 'поле coutnry должно быть заполненно'],
  },
  director: {
    type: String,
    required: [true, 'поле director должно быть заполненно'],
  },
  duration: {
    type: Number,
    required: [true, 'поле duration должно быть заполненно'],
  },
  year: {
    type: String,
    required: [true, 'поле year должно быть заполненно'],
  },
  description: {
    type: String,
    required: [true, 'поле description должно быть заполненно'],
  },
  image: {
    type: String,
    required: [true, 'поле image должно быть заполненно'],
    validate: {
      validator(v) {
        return urlRegular.test(v);
      },
      message: 'введите url',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'поле trailerLink должно быть заполненно'],
    validate: {
      validator(v) {
        return urlRegular.test(v);
      },
      message: 'введите url',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'поле thumbnail должно быть заполненно'],
    validate: {
      validator(v) {
        return urlRegular.test(v);
      },
      message: 'введите url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: [true, 'поле movieId должно быть заполненно'],
  },
  nameRU: {
    type: String,
    required: [true, 'поле nameRu должно быть заполненно'],
  },
  nameEN: {
    type: String,
    required: [true, 'поле nameEn должно быть заполненно'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
