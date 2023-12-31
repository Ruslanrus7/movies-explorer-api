const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegular = require('../utils/constans');
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegular),
    trailerLink: Joi.string().required().pattern(urlRegular),
    thumbnail: Joi.string().required().pattern(urlRegular),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
